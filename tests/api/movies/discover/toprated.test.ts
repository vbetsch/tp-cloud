import { describe, expect, it } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/movies/discover/toprated';
import { NextApiRequest, NextApiResponse } from 'next';
import { getTopRatedMovies } from '../../../../src/queries/themoviedb/queries';

jest.mock('../../../../src/queries/themoviedb/queries', () => ({
	getTopRatedMovies: jest.fn(),
}));

describe('[API] /movies/discover/toprated', () => {
	it('GET - should return paginated movies without page value', async () => {
		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(200);
	});
	it('GET - should return paginated movies with specified page value', async () => {
		const { req, res } = createMocks({
			method: 'GET',
			query: { page: 17 },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(200);
	});
	it('GET - should return 500', async () => {
		(getTopRatedMovies as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: 'Impossible to get toprated movies' });
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
