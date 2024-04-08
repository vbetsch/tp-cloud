import { API, getAPIDataFromUrl } from '../../config/api';
import { JwtPayload } from 'jsonwebtoken';

const getAuthUser = async (): Promise<{ user: JwtPayload | string | null }> => {
	const url: string = `${API.BASEURL}${API.URIS.AUTH.BASE_URI}${API.URIS.AUTH.SUB_URIS.USER}`;
	return await getAPIDataFromUrl(url, `Get user authenticated`);
};

export { getAuthUser };
