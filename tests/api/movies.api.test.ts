import { describe, it, expect, xit } from '@jest/globals';
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/movies/index';
import { createMocks } from 'node-mocks-http';
// import { getMoviesDiscover } from '../../src/queries/themoviedb/queries';

jest.mock('../../src/queries/themoviedb/queries', () => ({
	getMoviesDiscover: jest.fn(),
}));

describe('[API] /movies', () => {
	// it('should return paginated movies with default page value', async () => {
	// 	const { req, res } = createMocks({
	// 		method: 'GET',
	// 	});
	//
	// 	await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
	//
	// 	const responseData = res._getJSONData();
	// 	expect(res._getStatusCode()).toBe(200);
	// 	expect(responseData.results).toBeTruthy();
	// });

	// it('should return paginated movies with specified page value', async () => {
	// 	const page = 17;
	//
	// 	const { req, res } = createMocks({
	// 		method: 'GET',
	// 		query: { page: page.toString() },
	// 	});
	//
	// 	(getMoviesDiscover as jest.Mock).mockResolvedValue({});
	//
	// 	await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
	//
	// 	const responseData = res._getJSONData();
	// 	expect(res._getStatusCode()).toBe(200);
	// 	expect(responseData.page).toEqual(page);
	// });

	xit('should return 405 if method is not allowed', async () => {
		const { req, res } = createMocks({
			method: 'PUT',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(405);
		expect(res._getJSONData().error).toBe('Method Not Allowed');
	});
});
