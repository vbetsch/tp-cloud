import { HttpMethods } from '../../types/HttpMethods';

const TMDB_MOVIES = {
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

export { TMDB_MOVIES, getDataFromUrl };
