import { API, getAPIDataFromUrl, postAPIDataFromUrl } from '../../config/api';
import { JwtPayload } from 'jsonwebtoken';
import { SignInBodyRequest } from '../../../pages/api/auth/signin';
import { UserType } from '../../types/mongodb/UserType';

export interface AuthUser {
	user: JwtPayload | string | null;
	token: string;
}

const getAuthUser = async (): Promise<AuthUser> => {
	const url: string = `${API.URIS.AUTH.BASE_URI}${API.URIS.AUTH.SUB_URIS.USER}`;
	return await getAPIDataFromUrl(url, 'Get user authenticated');
};

const signUp = async (body: UserType) => {
	const url: string = `${API.URIS.AUTH.BASE_URI}${API.URIS.AUTH.SUB_URIS.SIGNUP}`;
	return await postAPIDataFromUrl(url, 'Sign up', body);
};

const signIn = async (body: SignInBodyRequest) => {
	const url: string = `${API.URIS.AUTH.BASE_URI}${API.URIS.AUTH.SUB_URIS.SIGNIN}`;
	return await postAPIDataFromUrl(url, 'Sign in', body);
};

const logOut = async () => {
	const url: string = `${API.URIS.AUTH.BASE_URI}${API.URIS.AUTH.SUB_URIS.LOGOUT}`;
	return await postAPIDataFromUrl(url, 'Log out');
};

export { getAuthUser, signUp, signIn, logOut };
