import { ConfigService } from '../services/config.service';
import { HttpMethods } from '../types/HttpMethods';

const TMDB_HEADERS = {
	accept: 'application/json',
	Authorization: `Bearer ${process.env.API_TOKEN}`,
};

const GET_OPTIONS = {
	method: HttpMethods.GET,
	headers: TMDB_HEADERS,
};

export const getMoviesDiscover = async () => {
	const url = ConfigService.THEMOVIEDB.BASEURL + ConfigService.THEMOVIEDB.URIS.DISCOVER;
	try {
		const apiResponse = await fetch(url, GET_OPTIONS)
			.then(r => r.json())
			.catch(err => console.error('error:' + err));
		return apiResponse.results;
	} catch (e) {
		console.error(e);
	}
};

export const getMovieById = async (idMovie: number) => {
	const url = `${ConfigService.THEMOVIEDB.BASEURL}${ConfigService.THEMOVIEDB.URIS.MOVIE}/${idMovie}`;
	try {
		return await fetch(url, GET_OPTIONS)
			.then(r => r.json())
			.catch(err => console.error('error:' + err));
	} catch (e) {
		console.error(e);
	}
};
