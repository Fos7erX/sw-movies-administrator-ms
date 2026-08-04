import { NotFoundException } from '@nestjs/common';
import { of } from 'rxjs';
import { MoviesManagementService } from './movies-management.service';

describe('MoviesManagementService', () => {
  let service: MoviesManagementService;
  const mockRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    upsert: jest.fn(),
  };
  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MoviesManagementService(
      mockRepo as any,
      mockHttpService as any,
    );
  });

  it('should return local movies when repository contains data', async () => {
    const localMovies = [{ id: 1, title: 'A New Hope' }];
    mockRepo.find.mockResolvedValue(localMovies);

    const result = await service.getAllMovies();

    expect(mockRepo.find).toHaveBeenCalledWith({
      order: {
        releaseDate: 'ASC',
      },
    });
    expect(result).toEqual(localMovies);
  });

  it('should return movie details when found by id', async () => {
    const movie = { id: 1, title: 'A New Hope' };
    mockRepo.findOne.mockResolvedValue(movie);

    const result = await service.getMovieDetails({ id: 1 } as any);

    expect(mockRepo.findOne).toHaveBeenCalledWith({
      where: [
        { id: 1 },
        { externalId: '1' },
      ],
    });
    expect(result).toEqual(movie);
  });

  it('should throw NotFoundException when movie details are missing', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.getMovieDetails({ id: 99 } as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a new movie through the repository', async () => {
    const movieData = { title: 'A New Hope' };
    const savedMovie = { id: 1, ...movieData };
    mockRepo.create.mockReturnValue(movieData);
    mockRepo.save.mockResolvedValue(savedMovie);

    const result = await service.createMovie(movieData as any);

    expect(mockRepo.create).toHaveBeenCalledWith(movieData);
    expect(mockRepo.save).toHaveBeenCalledWith(movieData);
    expect(result).toEqual(savedMovie);
  });

  it('should update a movie and return the updated record', async () => {
    const updateDto = { id: 1, title: 'A New Hope Updated' };
    const updatedMovie = { id: 1, title: 'A New Hope Updated' };
    mockRepo.update.mockResolvedValue({});
    mockRepo.findOneBy.mockResolvedValue(updatedMovie);

    const result = await service.updateMovie(updateDto as any);

    expect(mockRepo.update).toHaveBeenCalledWith(updateDto.id, updateDto);
    expect(result).toEqual(updatedMovie);
  });

  it('should delete a movie by id', async () => {
    const deleteDto = { id: 1 };

    await service.deleteMovie(deleteDto as any);

    expect(mockRepo.delete).toHaveBeenCalledWith(deleteDto.id);
  });

  it('should synchronize movies from SWAPI and upsert repository records', async () => {
    mockHttpService.get.mockImplementation((url: string) => {
      if (url.endsWith('/films')) {
        return of({ data: { result: [{ uid: '1' }, { uid: '2' }] } });
      }
      const uid = url.split('/').pop();
      return of({
        data: {
          result: {
            uid,
            description: `Film ${uid}`,
            properties: {
              title: `Movie ${uid}`,
              opening_crawl: 'Some text',
              director: 'Director',
              producer: 'Producer',
              release_date: '1977-05-25',
              episode_id: '4',
              url: `https://www.swapi.tech/api/films/${uid}`,
            },
          },
        },
      });
    });

    const result = await service.syncMoviesFromAPI();

    expect(mockHttpService.get).toHaveBeenCalledWith('https://www.swapi.tech/api/films');
    expect(mockRepo.upsert).toHaveBeenCalledWith(expect.any(Array), ['externalId']);
    expect(result).toEqual({
      message: 'Películas sincronizadas correctamente',
      synchronized: 2,
    });
  });
});
