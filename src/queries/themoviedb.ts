import { getTMDBDataFromUrl, TMDB_MOVIES } from '../config/themoviedb';
import { MovieDetailsType } from '../types/themoviedb/MovieTypes';
import { ResponseVideosOfMovie } from '../types/themoviedb/queries/ResponseVideosOfMovie';
import { ResponsePaginatedMovies } from '../types/themoviedb/queries/ResponsePaginatedMovies';

const getMovieById = async (idMovie: number): Promise<MovieDetailsType> => {
	const url: string = `${TMDB_MOVIES.URIS.MOVIE.BASE_URI}/${idMovie}`;
	return await getTMDBDataFromUrl(url, `Get movie ${idMovie}`);
};

const getVideosOfMovie = async (idMovie: number): Promise<ResponseVideosOfMovie> => {
	const url: string = `${TMDB_MOVIES.URIS.MOVIE.BASE_URI}/${idMovie}${TMDB_MOVIES.URIS.MOVIE.SUB_URIS.VIDEOS}`;
	return await getTMDBDataFromUrl(url, `Get videos of movie ${idMovie}`);
};

const getMoviesDiscover = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${TMDB_MOVIES.URIS.DISCOVER}?page=${page}`;
	return await getTMDBDataFromUrl(url, `Get all movies (page ${page})`);
};

const getRecommendations = async (idMovie: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${TMDB_MOVIES.URIS.MOVIE.BASE_URI}/${idMovie}${TMDB_MOVIES.URIS.MOVIE.SUB_URIS.RECOMMENDATIONS}`;
	return await getTMDBDataFromUrl(url, `Get recommendations of ${idMovie}`);
};

const getTopRatedMovies = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${TMDB_MOVIES.URIS.MOVIE.BASE_URI}${TMDB_MOVIES.URIS.MOVIE.SUB_URIS.TOP_RATED}?page=${page}`;
	return await getTMDBDataFromUrl(url, `Get top rated movies (page ${page})`);
};

const getSearchMovies = async (query: string, page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${TMDB_MOVIES.URIS.SEARCH}?query=${query}&page=${page}`;
	return await getTMDBDataFromUrl(url, `Get movies by search of '${query}' (page ${page})`);
};

export { getMovieById, getVideosOfMovie, getMoviesDiscover, getRecommendations, getTopRatedMovies, getSearchMovies };
