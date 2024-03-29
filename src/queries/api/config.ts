import { fetchJsonByUrl } from '../fetch';
import { HttpMethods } from '../../types/http/HttpMethods';

const API = {
	BASEURL: 'http://localhost:3000/api',
	URIS: {
		MOVIES: {
			BASE_URI: '/movies',
			SUB_URIS: {},
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
