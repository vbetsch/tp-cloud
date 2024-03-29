import { API, getAPIDataFromUrl } from './config';
import { ResponsePaginatedMovies } from '../../types/themoviedb/queries/ResponsePaginatedMovies';

const getMovies = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${API.BASEURL}${API.URIS.MOVIES.BASE_URI}?page=${page}`;
	return await getAPIDataFromUrl(url, `Get all movies (page ${page})`);
};

export { getMovies };
