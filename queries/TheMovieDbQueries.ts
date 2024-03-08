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

export const getMoviesDiscover = async (): Promise<MovieDiscoverType[] | undefined> => {
	const url: string = ConfigService.THEMOVIEDB.BASEURL + ConfigService.THEMOVIEDB.URIS.DISCOVER;
	try {
		const response: Response = await fetch(url, options);
		const apiResponse: ResponseDiscover = await response.json();
		return apiResponse.results;
	} catch (e) {
		if (e instanceof Error) {
			console.error('Impossible to search for films to discover : ' + e.message);
		} else {
			console.error(e);
		}
	}
};

export const getMovieById = async (idMovie: number): Promise<MovieDetailsType | undefined> => {
	const url: string = `${ConfigService.THEMOVIEDB.BASEURL}${ConfigService.THEMOVIEDB.URIS.MOVIE}/${idMovie}`;
	try {
		const response: Response = await fetch(url, options);
		return (await response.json()) as MovieDetailsType;
	} catch (e) {
		if (e instanceof Error) {
			console.error('Unable to search for a film : ' + e.message);
		} else {
			console.error(e);
		}
	}
};
