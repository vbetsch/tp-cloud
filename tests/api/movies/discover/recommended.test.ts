import { describe, expect, it } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/movies/discover/recommended';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllIdMovies } from '../../../../src/queries/mongodb/queries';
import { getRecommendations } from '../../../../src/queries/themoviedb/queries';

jest.mock('../../../../src/queries/themoviedb/queries', () => ({
	getRecommendations: jest.fn((id: number) => ({
		page: 1,
		results: [
			{
				adult: false,
				backdrop_path: '/1n00NlOGRFZVs8coBxyZLm5l4EC.jpg',
				id,
				title: 'Transformers: The Last Knight',
				original_language: 'en',
				original_title: 'Transformers: The Last Knight',
				overview:
					'Autobots and Decepticons are at war, with humans on the sidelines. Optimus Prime is gone. The key to saving our future lies buried in the secrets of the past, in the hidden history of Transformers on Earth.',
				poster_path: '/s5HQf2Gb3lIO2cRcFwNL9sn1o1o.jpg',
				media_type: 'movie',
				genre_ids: [12, 14, 28],
				popularity: 60.552,
				release_date: '2017-06-16',
				video: false,
				vote_average: 6.054,
				vote_count: 5914,
			},
		],
		total_pages: 1,
		total_results: 1,
	})),
}));
jest.mock('../../../../src/queries/mongodb/queries', () => ({
	getAllIdMovies: jest.fn(),
}));

describe('[API] /movies/discover/recommended', () => {
	it('should return recommended movies', async () => {
		const _idArray: Array<number> = [123, 693134];

		(getAllIdMovies as jest.Mock).mockResolvedValue(_idArray);

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			total: _idArray.length,
			movies: [
				{
					adult: false,
					backdrop_path: '/1n00NlOGRFZVs8coBxyZLm5l4EC.jpg',
					id: 123,
					title: 'Transformers: The Last Knight',
					original_language: 'en',
					original_title: 'Transformers: The Last Knight',
					overview:
						'Autobots and Decepticons are at war, with humans on the sidelines. Optimus Prime is gone. The key to saving our future lies buried in the secrets of the past, in the hidden history of Transformers on Earth.',
					poster_path: '/s5HQf2Gb3lIO2cRcFwNL9sn1o1o.jpg',
					media_type: 'movie',
					genre_ids: [12, 14, 28],
					popularity: 60.552,
					release_date: '2017-06-16',
					video: false,
					vote_average: 6.054,
					vote_count: 5914,
				},
				{
					adult: false,
					backdrop_path: '/1n00NlOGRFZVs8coBxyZLm5l4EC.jpg',
					id: 693134,
					title: 'Transformers: The Last Knight',
					original_language: 'en',
					original_title: 'Transformers: The Last Knight',
					overview:
						'Autobots and Decepticons are at war, with humans on the sidelines. Optimus Prime is gone. The key to saving our future lies buried in the secrets of the past, in the hidden history of Transformers on Earth.',
					poster_path: '/s5HQf2Gb3lIO2cRcFwNL9sn1o1o.jpg',
					media_type: 'movie',
					genre_ids: [12, 14, 28],
					popularity: 60.552,
					release_date: '2017-06-16',
					video: false,
					vote_average: 6.054,
					vote_count: 5914,
				},
			],
		});
	});
	it('should not return any recommended movie', async () => {
		const _idArray: Array<number> = [];

		(getAllIdMovies as jest.Mock).mockResolvedValue(_idArray);

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			total: 0,
			movies: [],
		});
	});
	it('should return 405 if method is not allowed', async () => {
		const { req, res } = createMocks({
			method: 'PUT',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(405);
		expect(res._getJSONData().error).toBe('Method Not Allowed');
	});
	it('should return 500 for getAllIdMovies error', async () => {
		(getAllIdMovies as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: 'Impossible to get all id movies' });
	});
	it('should return 500 for getRecommendations error', async () => {
		const _idArray: Array<number> = [123];

		(getAllIdMovies as jest.Mock).mockResolvedValue(_idArray);
		(getRecommendations as jest.Mock).mockImplementationOnce(() => {
			throw new Error('TEST');
		});

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: 'Impossible to get recommendations' });
	});
});
