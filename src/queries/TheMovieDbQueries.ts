import { ConfigService } from '../services/config.service';
import { HttpMethods } from '../types/HttpMethods';
import { MovieDetailsType, MovieDiscoverType } from '../types/themoviedb/MovieTypes';

const options: RequestInit = {
	method: HttpMethods.GET,
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${process.env.API_TOKEN}`,
	},
};

interface ResponseDiscover {
	page: number;
	results: MovieDiscoverType[];
	total_pages: number;
	total_results: number;
}

const getDataFromUrl = async (url: string, infoText: string) => {
	const response: Response = await fetch(url, options);
	const result = await response.json();
	console.info('INFO: ' + infoText);
	return result;
};

export const getMoviesDiscover = async (): Promise<MovieDiscoverType[]> => {
	const url: string = ConfigService.THEMOVIEDB.BASEURL + ConfigService.THEMOVIEDB.URIS.DISCOVER;
	const apiResponse: ResponseDiscover = await getDataFromUrl(url, 'Get movies to discover');
	return apiResponse.results;
};

export const getMovieById = async (idMovie: number): Promise<MovieDetailsType> => {
	const url: string = `${ConfigService.THEMOVIEDB.BASEURL}${ConfigService.THEMOVIEDB.URIS.MOVIE}/${idMovie}`;
	return await getDataFromUrl(url, 'Get movie by ID');
};
