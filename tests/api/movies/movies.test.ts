import { describe, it, expect } from '@jest/globals';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/movies/index';
import { createMocks } from 'node-mocks-http';
import { getMoviesDiscover } from '../../../src/queries/themoviedb/queries';

jest.mock('../../../src/queries/themoviedb/queries', () => ({
	getMoviesDiscover: jest.fn(),
}));

describe('[API] /movies', () => {
	it('should return paginated movies with default page value', async () => {
		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(200);
	});
	it('should return paginated movies with specified page value', async () => {
		const { req, res } = createMocks({
			method: 'GET',
			query: { page: 17 },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(200);
	});
	it('should return 405 if method is not allowed', async () => {
		const { req, res } = createMocks({
			method: 'PUT',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(405);
		expect(res._getJSONData().error).toBe('Method Not Allowed');
	});
	it('should return 500', async () => {
		(getMoviesDiscover as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to search movies to discover' });
	});
});
