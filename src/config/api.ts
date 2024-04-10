import { HttpMethods } from '../types/http/HttpMethods';
import { fetchJsonByUrl } from '../queries/fetch';
import { SignInBodyRequest } from '../../pages/api/auth/signin';
import { UserType } from '../types/mongodb/UserType';

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
				SIGNUP: '/signup',
				SIGNIN: '/signin',
				LOGOUT: '/logout',
			},
		},
	},
};

const doAPIDataFromUrl = async (url: string, infoText: string, options: RequestInit) => {
	const result = await fetchJsonByUrl(url, options);
	console.info('INFO: ' + infoText);
	return result;
};

const getAPIDataFromUrl = async (url: string, infoText: string) => {
	const options: RequestInit = {
		method: HttpMethods.GET,
		headers: {
			accept: 'application/json',
		},
	};
	return await doAPIDataFromUrl(url, infoText, options);
};

const postAPIDataFromUrl = async (url: string, infoText: string, body?: SignInBodyRequest | UserType) => {
	const options: RequestInit = {
		method: HttpMethods.POST,
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
		},
	};
	return await doAPIDataFromUrl(url, infoText, options);
};

export { API, getAPIDataFromUrl, postAPIDataFromUrl };
