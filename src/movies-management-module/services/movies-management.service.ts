import { Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../../database-module/entities/movie.entity';
import { Repository, In } from 'typeorm';
import { UpdateMovieRequestDto } from '../dtos/request/update-movie-request.dto';
import { mapSwapiMovieToEntity } from '../mappers/map-swapi-movie-to-entity.mapper';
import { GetMovieDetailsRequestDto } from '../dtos/request/get-movie-details-request.dto';
import { CreateMovieRequestDto } from '../dtos/request/create-movie-request.dto';
import { DeleteMovieRequestDto } from '../dtos/request/delete-movie-request.dto';

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
        const swapiMovies = await this.syncMoviesFromAPI();
        if (swapiMovies.synchronized == 0) {
          throw new NotFoundException('No se encontraron películas');
        } else {
          return swapiMovies;
        }
      } else {
        return localMoviesRepo;
      }
    } catch (error: any) {
      console.error('SWAPI Error Status:', error.response?.status);
      console.error('SWAPI Error Data:', error.response?.data);

      throw error;
    }
  }

  async getMovieDetails(getMovieDetailsRequestDto: GetMovieDetailsRequestDto) {
    const movie = await this.moviesRepository.findOne({
      where: [
        { id: Number(getMovieDetailsRequestDto.id) },
        { externalId: String(getMovieDetailsRequestDto.id) },
      ],
    });

    if (!movie) {
      throw new NotFoundException('No se encontró la película.');
    }

    return movie;
  }

  async createMovie(createMovieRequestDto: CreateMovieRequestDto) {
    //Solo para ADMIN
    const movie = this.moviesRepository.create(createMovieRequestDto);
    return this.moviesRepository.save(movie);
  }

  async updateMovie(updateMovieRequestDto: UpdateMovieRequestDto) {
    //Solo para ADMIN
    await this.moviesRepository.update(
      updateMovieRequestDto.id,
      updateMovieRequestDto,
    );
    return this.moviesRepository.findOneBy({ id: updateMovieRequestDto.id });
  }

  async deleteMovie(deleteMovieRequestDto: DeleteMovieRequestDto) {
    //Solo para ADMIN
    await this.moviesRepository.delete(deleteMovieRequestDto.id);
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

      //Debido a un error de externalid not set (Lo cual genera un 503: Service Unavailable, se genera el siguiente fix)

      //Normalización de externalIds 
      const externalIds = movies.map((m) => m.externalId).filter(Boolean);

      let moviesToUpsert = movies;

      if (externalIds.length > 0) {
        const existing = await this.moviesRepository.find({
          where: { externalId: In(externalIds as string[]) },
        });

        const existingMap = new Map(
          existing.map((e) => [String(e.externalId), e]),
        );

        moviesToUpsert = movies.map((m) => {
          const ex = existingMap.get(String(m.externalId));
          if (ex && ex.id) {
            m.id = ex.id;
          }
          return m;
        });
      }
      //

      // Inserto películas  si no existen o actualiza si existen con upsert, método nativo de typeOrm, así me evito sobrecomplicar código.
      await this.moviesRepository.upsert(movies, ['externalId']);

      if (!Array.isArray(movies) || movies.length === 0) {
        throw new NotFoundException(
          'No se encontraron películas en la API externa.',
        );
      } else {
        return {
          //TODO: Mapear response en un DTO
          message: 'Películas sincronizadas correctamente',
          synchronized: movies.length,
        };
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
