import { HttpMethods } from '../types/http/HttpMethods';
import { fetchJsonByUrl } from '../queries/fetch';

const API = {
	BASEURL: '/api',
	URIS: {
		MOVIES: {
			BASE_URI: '/movies',
			SUB_URIS: {},
		},
		AUTH: {
			BASE_URI: '/auth',
			SUB_URIS: {
				USER: '/user',
			},
		},
	},
};

const getAPIDataFromUrl = async (url: string, infoText: string) => {
	const options: RequestInit = {
		method: HttpMethods.GET,
		headers: {
			accept: 'application/json',
		},
	};
	const result = await fetchJsonByUrl(url, options);
	console.info('INFO: ' + infoText);
	return result;
};

export { API, getAPIDataFromUrl };
