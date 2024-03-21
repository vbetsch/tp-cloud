import { describe, expect } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/movies/[idMovie]/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMovieById } from '../../../../src/queries/themoviedb/queries';

jest.mock('../../../../src/queries/themoviedb/queries', () => ({
	getMovieById: jest.fn(),
}));

jest.mock('../../../../lib/mongodb', () => ({
	__esModule: true,
	default: {
		db: jest.fn(() => ({
			collection: jest.fn(() => ({
				findOne: jest.fn(async () => ({
					idTMDB: 123,
					likeCounter: 5,
				})),
			})),
		})),
	},
}));

describe('[API] /movies/{idMovie}', () => {
	it('should return movie with likes', async () => {
		const movieId: number = 123;

		(getMovieById as jest.Mock).mockResolvedValue({});

		const { req, res } = createMocks({
			method: 'GET',
			url: `/api/movies/${movieId}`,
			query: { idMovie: movieId.toString() },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();

		const responseData = res._getJSONData();
		expect(responseData.likes).toBeDefined();
	});
	it('should return 405 if method is not allowed', async () => {
		const { req, res } = createMocks({
			method: 'PUT',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(405);
		expect(res._getJSONData().error).toBe('Method Not Allowed');
	});
});
