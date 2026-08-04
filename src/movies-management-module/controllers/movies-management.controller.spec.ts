import { MoviesManagementController } from './movies-management.controller';

describe('MoviesManagementController', () => {
  let controller: MoviesManagementController;
  const mockService = {
    getAllMovies: jest.fn(),
    getMovieDetails: jest.fn(),
    createMovie: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
    syncMoviesFromAPI: jest.fn(),
  };

  beforeEach(() => {
    controller = new MoviesManagementController(mockService as any);
    jest.clearAllMocks();
  });

  it('should return all movies from the service', async () => {
    const movies = [{ id: 1, title: 'A New Hope' }];
    mockService.getAllMovies.mockResolvedValue(movies);

    const result = await controller.getAllMovies();

    expect(mockService.getAllMovies).toHaveBeenCalled();
    expect(result).toEqual(movies);
  });

  it('should return movie details from the service', async () => {
    const movie = { id: 1, title: 'A New Hope' };
    mockService.getMovieDetails.mockResolvedValue(movie);

    const result = await controller.getMovieDetails({ id: 1 } as any, 'Bearer abc');

    expect(mockService.getMovieDetails).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(movie);
  });

  it('should create a movie using the service', async () => {
    const createdMovie = { id: 1, title: 'A New Hope' };
    mockService.createMovie.mockResolvedValue(createdMovie);

    const result = await controller.createMovie({ title: 'A New Hope' } as any);

    expect(mockService.createMovie).toHaveBeenCalledWith({ title: 'A New Hope' });
    expect(result).toEqual(createdMovie);
  });

  it('should update a movie using the service', async () => {
    const updatedMovie = { id: 1, title: 'A New Hope Updated' };
    mockService.updateMovie.mockResolvedValue(updatedMovie);

    const result = await controller.updateMovie({ id: 1, title: 'A New Hope Updated' } as any);

    expect(mockService.updateMovie).toHaveBeenCalledWith({ id: 1, title: 'A New Hope Updated' });
    expect(result).toEqual(updatedMovie);
  });

  it('should delete a movie using the service', async () => {
    mockService.deleteMovie.mockResolvedValue(undefined);

    const result = await controller.deleteMovie({ id: 1 } as any);

    expect(mockService.deleteMovie).toHaveBeenCalledWith({ id: 1 });
    expect(result).toBeUndefined();
  });
});
