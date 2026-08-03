import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteMovieDto } from '../dtos/delete-movie.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GetMovieDetailsDto } from '../dtos/get-movie-details.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../../database-module/entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';
import { mapSwapiMovieToEntity } from '../mappers/map-swapi-movie-to-entity.mapper';

@Injectable()
export class MoviesManagementService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    private readonly httpService: HttpService,
  ) {}

  async getAllMovies() {
    try {
      const localMoviesRepo = await this.moviesRepository.find({
        order: {
          releaseDate: 'ASC',
        },
      });

      if (Array.isArray(localMoviesRepo) && localMoviesRepo.length === 0) {
        return await this.syncMoviesFromAPI();
      } else {
        return localMoviesRepo;
      }
      // try {
      //   //1. Primero me traigo todas las películas de la tabla movies
      //   const localMovies = await this.moviesRepository.find();

      //   //Luego, me traigo todas las películas de la API de SWAPI

      //   let swapiMovies: Array<any> = [];
      //   const response = await firstValueFrom(
      //     this.httpService.get('https://www.swapi.tech/api/films/'),
      //   );
      //   swapiMovies = response.data.result ?? [];

      //   //Ahora que tengo ambos datos, voy a mapear las películas de swapi para mergear ambos arrays, y así poder retornar todo junto.
      //   const mappedSwapiMovies = swapiMovies.map((swapiMovie) =>
      //     mapSwapiMovieToEntity(swapiMovie),
      //   );

      //   //Ahora voy a filtrar las películas repetidas:
      //   const localExternalIds = new Set(
      //     localMovies.map((movie) => movie.externalId).filter(Boolean),
      //   );

      //   // Agrego las películas de SWAPI que no existen localmente
      //   const newSwapiMovies = mappedSwapiMovies.filter(
      //     (movie) => !localExternalIds.has(movie.externalId),
      //   );

      //   // Y finalmente hago el merge de ambos arrays, para retornar todas las películas
      //   return [...localMovies, ...newSwapiMovies];
    } catch (error: any) {
      console.error('SWAPI Error Status:', error.response?.status);
      console.error('SWAPI Error Data:', error.response?.data);

      throw error;
    }
  }

  async getMovieDetails(getMovieDetailsDto: GetMovieDetailsDto) {
    const movie = await this.moviesRepository.findOne({
      where: [
        { id: Number(getMovieDetailsDto.id) },
        { externalId: String(getMovieDetailsDto.id) },
      ],
    });

    if (!movie) {
      throw new NotFoundException('No se encontró la película.');
    }

    return movie;
  }

  async createMovie(createMovieDto: CreateMovieDto) {
    //Solo para ADMIN
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  async updateMovie(updateMovieDto: UpdateMovieDto) {
    //Solo para ADMIN
    await this.moviesRepository.update(updateMovieDto.id, updateMovieDto);
    return this.moviesRepository.findOneBy({ id: updateMovieDto.id });
  }

  async deleteMovie(deleteMovieDto: DeleteMovieDto) {
    //Solo para ADMIN
    await this.moviesRepository.delete(deleteMovieDto.id);
  }

  async syncMoviesFromAPI() {
    //Solo para ADMINasync syncMoviesFromAPI() {
    try {
      // Obtengo el listado de películas
      const response = await firstValueFrom(
        this.httpService.get('https://www.swapi.tech/api/films'),
      );

      const films = response.data.result ?? [];

      // Obtengo el detalle de cada película en paralelo
      const detailResponses = await Promise.all(
        films.map((film) =>
          firstValueFrom(
            this.httpService.get(
              `https://www.swapi.tech/api/films/${film.uid}`,
            ),
          ),
        ),
      );

      //Hago map de las peliculas de swapi para amoldarlas a la entidad movie
      const movies = detailResponses.map((response) =>
        mapSwapiMovieToEntity(response.data.result),
      );

      // Inserto películas  si no existen o actualiza si existen con upsert, método nativo de typeOrm, así me evito sobrecomplicar código.
      await this.moviesRepository.upsert(movies, ['externalId']);

      return {
        message: 'Películas sincronizadas correctamente',
        synchronized: movies.length,
      };
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
