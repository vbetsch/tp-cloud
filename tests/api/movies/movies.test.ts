import { describe, it, expect } from '@jest/globals';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/movies/index';
import { createMocks } from 'node-mocks-http';
import { getMoviesDiscover } from '../../../src/queries/themoviedb/queries';

jest.mock('../../../src/queries/themoviedb/queries', () => ({
	getMoviesDiscover: jest.fn(),
}));

describe('[API] /movies', () => {
	it('GET - should return paginated movies without page value', async () => {
		const _results = {
			page: 1,
			results: [
				{
					adult: false,
					backdrop_path: '/mEoIDEiePnYj178H9znzbl9zvky.jpg',
					genre_ids: [1, 2, 3],
					id: 1006540,
					original_language: 'en',
					original_title: 'Bullet Train Down',
					overview:
						"On its maiden run, the world's fastest bullet train is rigged with a bomb that will explode if it dips below 200 mph.",
					popularity: 682.584,
					poster_path: '/5a7cocgyVuFjYV71neDIGVzD6Yq.jpg',
					release_date: '2022-08-01',
					title: 'Bullet Train Down',
					video: false,
					vote_average: 4.714,
					vote_count: 14,
				},
				{
					adult: false,
					backdrop_path: '/mEoIDEiePnYj178H9znzbl9zvky.jpg',
					genre_ids: [1, 2, 3],
					id: 1006540,
					original_language: 'en',
					original_title: 'Bullet Train Down',
					overview:
						"On its maiden run, the world's fastest bullet train is rigged with a bomb that will explode if it dips below 200 mph.",
					popularity: 682.584,
					poster_path: '/5a7cocgyVuFjYV71neDIGVzD6Yq.jpg',
					release_date: '2022-08-01',
					title: 'Bullet Train Down',
					video: false,
					vote_average: 4.714,
					vote_count: 14,
				},
				{
					adult: false,
					backdrop_path: '/mEoIDEiePnYj178H9znzbl9zvky.jpg',
					genre_ids: [1, 2, 3],
					id: 1006540,
					original_language: 'en',
					original_title: 'Bullet Train Down',
					overview:
						"On its maiden run, the world's fastest bullet train is rigged with a bomb that will explode if it dips below 200 mph.",
					popularity: 682.584,
					poster_path: '/5a7cocgyVuFjYV71neDIGVzD6Yq.jpg',
					release_date: '2022-08-01',
					title: 'Bullet Train Down',
					video: false,
					vote_average: 4.714,
					vote_count: 14,
				},
			],
			total_pages: 43183,
			total_results: 863641,
		};

		(getMoviesDiscover as jest.Mock).mockResolvedValue(_results);

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_results);
	});
	it('GET - should return paginated movies with specified page value', async () => {
		const _results = {
			page: 17,
			results: [
				{
					adult: false,
					backdrop_path: '/mEoIDEiePnYj178H9znzbl9zvky.jpg',
					genre_ids: [1, 2, 3],
					id: 1006540,
					original_language: 'en',
					original_title: 'Bullet Train Down',
					overview:
						"On its maiden run, the world's fastest bullet train is rigged with a bomb that will explode if it dips below 200 mph.",
					popularity: 682.584,
					poster_path: '/5a7cocgyVuFjYV71neDIGVzD6Yq.jpg',
					release_date: '2022-08-01',
					title: 'Bullet Train Down',
					video: false,
					vote_average: 4.714,
					vote_count: 14,
				},
				{
					adult: false,
					backdrop_path: '/mEoIDEiePnYj178H9znzbl9zvky.jpg',
					genre_ids: [1, 2, 3],
					id: 1006540,
					original_language: 'en',
					original_title: 'Bullet Train Down',
					overview:
						"On its maiden run, the world's fastest bullet train is rigged with a bomb that will explode if it dips below 200 mph.",
					popularity: 682.584,
					poster_path: '/5a7cocgyVuFjYV71neDIGVzD6Yq.jpg',
					release_date: '2022-08-01',
					title: 'Bullet Train Down',
					video: false,
					vote_average: 4.714,
					vote_count: 14,
				},
				{
					adult: false,
					backdrop_path: '/mEoIDEiePnYj178H9znzbl9zvky.jpg',
					genre_ids: [1, 2, 3],
					id: 1006540,
					original_language: 'en',
					original_title: 'Bullet Train Down',
					overview:
						"On its maiden run, the world's fastest bullet train is rigged with a bomb that will explode if it dips below 200 mph.",
					popularity: 682.584,
					poster_path: '/5a7cocgyVuFjYV71neDIGVzD6Yq.jpg',
					release_date: '2022-08-01',
					title: 'Bullet Train Down',
					video: false,
					vote_average: 4.714,
					vote_count: 14,
				},
			],
			total_pages: 43183,
			total_results: 863641,
		};

		(getMoviesDiscover as jest.Mock).mockResolvedValue(_results);

		const { req, res } = createMocks({
			method: 'GET',
			query: { page: 17 },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_results);
	});
	it('GET - should return 500', async () => {
		(getMoviesDiscover as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to search movies to discover' });
	});
	it('should return 405 if method is not allowed', async () => {
		const { req, res } = createMocks({
			method: 'PUT',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(405);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Method Not Allowed' });
	});
});
