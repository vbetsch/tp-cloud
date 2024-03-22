import { describe, expect } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/movies/[idMovie]/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMovieById } from '../../../../src/queries/themoviedb/queries';
import { findOneLikeById } from '../../../../src/queries/mongodb/queries';

const movieId: number = 123;
const counterLike: number = 5;

jest.mock('../../../../src/queries/themoviedb/queries', () => ({
	getMovieById: jest.fn(),
}));

jest.mock('../../../../src/queries/mongodb/queries', () => ({
	findOneLikeById: jest.fn(),
}));

describe('[API] /movies/{idMovie}', () => {
	it('should return movie with likes', async () => {
		(getMovieById as jest.Mock).mockResolvedValue({
			id: movieId,
		});

		(findOneLikeById as jest.Mock).mockResolvedValue({
			idTMDB: movieId,
			likeCounter: counterLike,
		});

		const { req, res } = createMocks({
			method: 'GET',
			query: { idMovie: movieId },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();

		const responseData = res._getJSONData();
		expect(responseData.id).toBe(movieId);
		expect(responseData.likes).toBe(counterLike);
	});
	it('should return 404 with error and 0 likes', async () => {
		const _error = {
			success: false,
			status_code: 34,
			status_message: 'The resource you requested could not be found.',
		};

		(getMovieById as jest.Mock).mockResolvedValue(_error);
		(findOneLikeById as jest.Mock).mockResolvedValue(null);

		const { req, res } = createMocks({
			method: 'GET',
			query: { idMovie: 41 },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(404);

		const { success, status_code, status_message } = _error;
		const responseData = res._getJSONData();

		expect(responseData.success).toBe(success);
		expect(responseData.status_code).toBe(status_code);
		expect(responseData.status_message).toBe(status_message);
		expect(responseData.likes).toBe(0);
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
