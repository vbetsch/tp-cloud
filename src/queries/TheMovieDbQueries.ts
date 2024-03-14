import { ConfigService } from '../services/ConfigService';
import { HttpMethods } from '../types/HttpMethods';
import { MovieDetailsType, MovieDiscoverType } from '../types/themoviedb/MovieTypes';

const options: RequestInit = {
	method: HttpMethods.GET,
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${process.env.API_TOKEN}`,
	},
};

const getDataFromUrl = async (url: string, infoText: string) => {
	const response: Response = await fetch(url, options);
	const result = await response.json();
	console.info('INFO: ' + infoText);
	return result;
};

export const getMoviesDiscover = async (page: number): Promise<MovieDiscoverType[]> => {
	const url: string = `${ConfigService.THEMOVIEDB.BASEURL}${ConfigService.THEMOVIEDB.URIS.DISCOVER}?page=${page}`;
	return await getDataFromUrl(url, `Get all movies (page ${page})`);
};

export const getMovieById = async (idMovie: number): Promise<MovieDetailsType> => {
	const url: string = `${ConfigService.THEMOVIEDB.BASEURL}${ConfigService.THEMOVIEDB.URIS.MOVIE}/${idMovie}`;
	return await getDataFromUrl(url, 'Get movie by ID');
};
