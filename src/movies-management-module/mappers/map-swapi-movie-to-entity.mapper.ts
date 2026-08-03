import { Movie } from "../../database-module/entities/movie.entity";

export function mapSwapiMovieToEntity(swapiMovie: any): Partial<Movie> {
  const { properties } = swapiMovie;

  return {
    externalId: swapiMovie.uid,
    title: properties.title,
    description: swapiMovie.description,
    openingCrawl: properties.opening_crawl,
    director: properties.director,
    producer: properties.producer,
    releaseDate: properties.release_date,
    episodeId: properties.episode_id,
    swapiUrl: properties.url,
  };
}