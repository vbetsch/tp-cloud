import { HttpMethods } from '../types/HttpMethods';
import { MovieDetailsType, MovieDiscoverType } from '../types/themoviedb/MovieTypes';
import { VideoType } from '../types/themoviedb/VideoType';

const URLS = {
	BASEURL: 'https://api.themoviedb.org/3',
	URIS: {
		DISCOVER: '/discover/movie',
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

const movieBaseUrl: string = URLS.BASEURL + URLS.URIS.MOVIE.BASE_URI;

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
	const url: string = `${movieBaseUrl}/${idMovie}${URLS.URIS.MOVIE.SUB_URIS.VIDEOS}`;
	return await getDataFromUrl(url, `Get videos of movie ${idMovie}`);
};

export interface ResponsePaginatedMovies {
	page: number;
	results: MovieDiscoverType[];
	total_pages: number;
	total_results: number;
}

const getMoviesDiscover = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${URLS.BASEURL}${URLS.URIS.DISCOVER}?page=${page}`;
	return await getDataFromUrl(url, `Get all movies (page ${page})`);
};

const getRecommendations = async (idMovie: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${movieBaseUrl}/${idMovie}${URLS.URIS.MOVIE.SUB_URIS.RECOMMENDATIONS}`;
	return await getDataFromUrl(url, `Get recommendations of ${idMovie}`);
};

const getTopRatedMovies = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${movieBaseUrl}${URLS.URIS.MOVIE.SUB_URIS.TOP_RATED}?page=${page}`;
	return await getDataFromUrl(url, `Get top rated movies (page ${page})`);
};

export { getMovieById, getVideosOfMovie, getMoviesDiscover, getRecommendations, getTopRatedMovies };
