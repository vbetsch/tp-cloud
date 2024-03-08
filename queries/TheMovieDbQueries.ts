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
		const apiResponse: ResponseDiscover = await fetch(url, options)
			.then(r => r.json())
			.catch(err => console.error('error:' + err));
		return apiResponse.results;
	} catch (e) {
		console.error(e);
	}
};

export const getMovieById = async (idMovie: number): Promise<MovieDetailsType | undefined> => {
	const url: string = `${ConfigService.THEMOVIEDB.BASEURL}${ConfigService.THEMOVIEDB.URIS.MOVIE}/${idMovie}`;
	try {
		return await fetch(url, options)
			.then(r => r.json())
			.catch(err => console.error('error:' + err));
	} catch (e) {
		console.error(e);
	}
};
