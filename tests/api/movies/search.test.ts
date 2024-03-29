import { describe, expect, it } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/movies/search';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSearchMovies } from '../../../src/queries/themoviedb/queries';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { HttpMethods } from '../../../src/types/http/HttpMethods';

jest.mock('../../../src/queries/themoviedb/queries', () => ({
	getSearchMovies: jest.fn(),
}));

const PAGE: number = 7;
const PAGINATED_RESULTS = {
	page: 1,
	results: [
		{
			adult: false,
			backdrop_path: '/87IVlclAfWL6mdicU1DDuxdwXwe.jpg',
			genre_ids: [878, 12],
			id: 693134,
			original_language: 'en',
			original_title: 'Dune: Part Two',
			overview:
				'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.',
			popularity: 736.807,
			poster_path: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
			release_date: '2024-02-27',
			title: 'Dune: Part Two',
			video: false,
			vote_average: 8.399,
			vote_count: 2007,
		},
	],
	total_pages: 1,
	total_results: 1,
};

describe('[API] /movies/search', () => {
	it('GET - should return results movies', async () => {
		(getSearchMovies as jest.Mock).mockResolvedValue(PAGINATED_RESULTS);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: { query: 'Dune: Part Two' },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(PAGINATED_RESULTS);
	});
	it('GET - should return results movies with specified page value', async () => {
		const _response = {
			...PAGINATED_RESULTS,
			page: PAGE,
		};

		(getSearchMovies as jest.Mock).mockResolvedValue(_response);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: {
				query: 'chute',
				page: PAGE,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_response);
	});
	it('GET - should return 404', async () => {
		const _response = {
			...PAGINATED_RESULTS,
			results: [],
		};

		(getSearchMovies as jest.Mock).mockResolvedValue(_response);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.NOT_FOUND);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			message: "No movie was found with ''",
		});
	});
	it('GET - should return 404 with specified page value', async () => {
		const _response = {
			...PAGINATED_RESULTS,
			results: [],
		};

		(getSearchMovies as jest.Mock).mockResolvedValue(_response);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: { page: PAGE },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.NOT_FOUND);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			message: "No movie was found with ''",
		});
	});
	it('GET - should return 500', async () => {
		(getSearchMovies as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Impossible to search movies' });
	});
	it('should return 405 if method is not allowed', async () => {
		const { req, res } = createMocks({
			method: HttpMethods.PUT,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.METHOD_NOT_ALLOWED);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Method Not Allowed' });
	});
});
