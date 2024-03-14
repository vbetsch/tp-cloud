import { ConfigService } from '../services/ConfigService';
import { HttpMethods } from '../types/HttpMethods';
import { MovieDetailsType, MovieDiscoverType } from '../types/themoviedb/MovieTypes';
import { VideoType } from '../types/themoviedb/VideoType';

const movieBaseUrl: string = ConfigService.THEMOVIEDB.BASEURL + ConfigService.THEMOVIEDB.URIS.MOVIE.BASE_URI;

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

export const getMovieById = async (idMovie: number): Promise<MovieDetailsType> => {
	const url: string = `${movieBaseUrl}/${idMovie}`;
	return await getDataFromUrl(url, `Get movie ${idMovie}`);
};

export interface ResponseVideosOfMovie {
	id: number;
	results: VideoType[];
}

export const getVideosOfMovie = async (idMovie: number): Promise<ResponseVideosOfMovie> => {
	const url: string = `${movieBaseUrl}/${idMovie}${ConfigService.THEMOVIEDB.URIS.MOVIE.SUB_URIS.VIDEOS}`;
	return await getDataFromUrl(url, `Get videos of movie ${idMovie}`);
};

export interface ResponseMovies {
	page: number;
	results: MovieDiscoverType[];
	total_pages: number;
	total_results: number;
}

export const getMoviesDiscover = async (page: number): Promise<ResponseMovies> => {
	const url: string = `${ConfigService.THEMOVIEDB.BASEURL}${ConfigService.THEMOVIEDB.URIS.DISCOVER}?page=${page}`;
	return await getDataFromUrl(url, `Get all movies (page ${page})`);
};

export const getRecommendations = async (idMovie: number): Promise<ResponseMovies> => {
	const url: string = `${movieBaseUrl}/${idMovie}${ConfigService.THEMOVIEDB.URIS.MOVIE.SUB_URIS.RECOMMENDATIONS}`;
	return await getDataFromUrl(url, `Get recommendations of ${idMovie}`);
};
