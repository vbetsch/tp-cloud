import { HttpMethods } from '../../types/HttpMethods';

const API = {
	BASEURL: 'http://localhost:3000/api',
	URIS: {
		MOVIES: {
			BASE_URI: '/movies',
			SUB_URIS: {},
		},
	},
};

const options: RequestInit = {
	method: HttpMethods.GET,
	headers: {
		accept: 'application/json',
	},
};

const getDataFromUrl = async (url: string, infoText: string) => {
	const response: Response = await fetch(url, options);
	const result = await response.json();
	console.info('INFO: ' + infoText);
	return result;
};

export { API, getDataFromUrl };
