import { fetchJsonByUrl } from '../fetch';
import { HttpMethods } from '../../types/http/HttpMethods';

const TMDB_MOVIES = {
	BASEURL: 'https://api.themoviedb.org/3',
	IMAGEURL: 'https://image.tmdb.org/t/p',
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

const getTMDBDataFromUrl = async (url: string, infoText: string) => {
	const options: RequestInit = {
		method: HttpMethods.GET,
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer ' + process.env.API_TOKEN,
		},
	};
	const result = await fetchJsonByUrl(url, options);
	console.info('INFO: ' + infoText);
	return result;
};

export { TMDB_MOVIES, getTMDBDataFromUrl };
