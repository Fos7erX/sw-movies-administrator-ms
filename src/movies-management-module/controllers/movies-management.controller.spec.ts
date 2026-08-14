import { Test } from '@nestjs/testing';
import { MoviesManagementController } from './movies-management.controller';
import { MoviesManagementService } from '../services/movies-management.service';
import { GetMovieDetailsRequestDto } from '../dtos/request/get-movie-details-request.dto';
import { CreateMovieRequestDto } from '../dtos/request/create-movie-request.dto';
import { UpdateMovieRequestDto } from '../dtos/request/update-movie-request.dto';
import { DeleteMovieRequestDto } from '../dtos/request/delete-movie-request.dto';


//Corrección #2: Testing de controllers
// Aplico el mismo fix de Test.createTestingModule(), para poder obtener tests más integrales.
const mockMoviesService = {
  getAllMovies: jest.fn(),
  getMovieDetails: jest.fn(),
  createMovie: jest.fn(),
  updateMovie: jest.fn(),
  deleteMovie: jest.fn(),
  syncMoviesFromAPI: jest.fn(),
};

describe('MoviesManagementController (unit)', () => {
  let controller: MoviesManagementController;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [MoviesManagementController],
      providers: [
        { provide: MoviesManagementService, useValue: mockMoviesService },
      ],
    }).compile();

    controller = module.get(MoviesManagementController);
    jest.clearAllMocks();
  });

  it('should return all movies from the service', async () => {
    (mockMoviesService.getAllMovies as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'A New Hope',
    });
    await controller.getAllMovies();
    expect(mockMoviesService.getAllMovies).toHaveBeenCalled();
  });

  it('should return movie details from the service', async () => {
    const dto = { id: 1 } as GetMovieDetailsRequestDto;
    (mockMoviesService.getMovieDetails as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'A New Hope',
    });

    await controller.getMovieDetails(dto, 'Bearer abc');
    expect(mockMoviesService.getMovieDetails).toHaveBeenCalledWith(dto);
  });

  it('should create a movie using the service', async () => {
    const dto = { title: 'A New Hope' } as CreateMovieRequestDto; //Creo el DTO con una sola propiedad porque es la única que está marcada como required (Las demás son opcionales)
    (mockMoviesService.getMovieDetails as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'A New Hope',
    });

    await controller.createMovie(dto);
    expect(mockMoviesService.createMovie).toHaveBeenCalledWith(dto);
  });

  //Migrar el resto de tests

  it('should update a movie using the service', async () => {
    const dto = { title: 'A New Hope Updated' } as UpdateMovieRequestDto;

    (mockMoviesService.getMovieDetails as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'A New Hope Updated',
    });

    await controller.updateMovie(dto);
    expect(mockMoviesService.updateMovie).toHaveBeenCalledWith(dto);
  });

  it('should delete a movie using the service', async () => {
    const dto = { id: 1 } as DeleteMovieRequestDto;
    
    (mockMoviesService.deleteMovie as jest.Mock).mockResolvedValue(undefined);

    const result = await controller.deleteMovie(dto);
    expect(mockMoviesService.deleteMovie).toHaveBeenCalledWith({ id: 1 });
    expect(result).toBeUndefined();
  });
});
