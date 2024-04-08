import { ResponsePaginatedMovies } from '../../types/themoviedb/queries/ResponsePaginatedMovies';
import { API, getAPIDataFromUrl } from '../../config/api';

const getMovies = async (page: number): Promise<ResponsePaginatedMovies> => {
	const url: string = `${API.BASEURL}${API.URIS.MOVIES.BASE_URI}?page=${page}`;
	return await getAPIDataFromUrl(url, `Get all movies (page ${page})`);
};

export { getMovies };
