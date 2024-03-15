import { HttpMethods } from '../types/HttpMethods';
import { MovieDetailsType, MovieDiscoverType } from '../types/themoviedb/MovieTypes';
import { VideoType } from '../types/themoviedb/VideoType';

const MOVIES = {
	BASEURL: 'https://api.themoviedb.org/3',
	URIS: {
		DISCOVER: '/discover/movie',
		SEARCH: '/search/movie',
		MOVIE: {
			BASE_URI: '/movie',
			SUB_URIS: {
				VIDEOS: '/videos',
				RECOMMENDATIONS: '/recommendations',
				TOP_RATED: '/top_rated',
			},
		},
	},
};

const movieBaseUrl: string = MOVIES.BASEURL + MOVIES.URIS.MOVIE.BASE_URI;

const options: RequestInit = {
	method: HttpMethods.GET,
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer ' + process.env.API_TOKEN,
	},
};

const getDataFromUrl = async (url: string, infoText: string) => {
	const response: Response = await fetch(url, options);
	const result = await response.json();
	console.info('INFO: ' + infoText);
	return result;
};

const getMovieById = async (idMovie: number): Promise<MovieDetailsType> => {
	const url: string = `${movieBaseUrl}/${idMovie}`;
	return await getDataFromUrl(url, `Get movie ${idMovie}`);
};

export interface ResponseVideosOfMovie {
	id: number;
	results: VideoType[];
}

const getVideosOfMovie = async (idMovie: number): Promise<ResponseVideosOfMovie> => {
	const url: string = `${movieBaseUrl}/${idMovie}${MOVIES.URIS.MOVIE.SUB_URIS.VIDEOS}`;
	return await getDataFromUrl(url, `Get videos of movie ${idMovie}`);
};

export interface ResponsePaginatedMovies {
	page: number;
	results: MovieDiscoverType[];
	total_pages: number;
	total_results: number;
}

const getMoviesDiscover = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${MOVIES.BASEURL}${MOVIES.URIS.DISCOVER}?page=${page}`;
	return await getDataFromUrl(url, `Get all movies (page ${page})`);
};

const getRecommendations = async (idMovie: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${movieBaseUrl}/${idMovie}${MOVIES.URIS.MOVIE.SUB_URIS.RECOMMENDATIONS}`;
	return await getDataFromUrl(url, `Get recommendations of ${idMovie}`);
};

const getTopRatedMovies = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${movieBaseUrl}${MOVIES.URIS.MOVIE.SUB_URIS.TOP_RATED}?page=${page}`;
	return await getDataFromUrl(url, `Get top rated movies (page ${page})`);
};

const getSearchMovies = async (query: string, page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${MOVIES.BASEURL}${MOVIES.URIS.SEARCH}?query=${query}&page=${page}`;
	return await getDataFromUrl(url, `Get movies by search of '${query}' (page ${page})`);
};

export { getMovieById, getVideosOfMovie, getMoviesDiscover, getRecommendations, getTopRatedMovies, getSearchMovies };
