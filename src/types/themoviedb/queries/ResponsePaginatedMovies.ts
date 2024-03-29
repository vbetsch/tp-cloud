import { MovieDiscoverType } from '../MovieTypes';

export interface ResponsePaginatedMovies {
	page: number;
	results: MovieDiscoverType[];
	total_pages: number;
	total_results: number;
}
