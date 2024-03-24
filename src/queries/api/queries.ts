import { API, getDataFromUrl } from './config';
import { ResponsePaginatedMovies } from '../themoviedb/queries';

const getMovies = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${API.BASEURL}${API.URIS.MOVIES.BASE_URI}?page=${page}`;
	return await getDataFromUrl(url, `Get all movies (page ${page})`);
};

export { getMovies };
