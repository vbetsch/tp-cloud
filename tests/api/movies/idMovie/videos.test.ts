import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/movies/[idMovie]/videos';
import { NextApiRequest, NextApiResponse } from 'next';
import { getVideosOfMovie } from '../../../../src/queries/themoviedb/queries';
import { expect, it } from '@jest/globals';
import { HttpMethods } from '../../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../../src/types/http/HttpCodeStatus';

jest.mock('../../../../src/queries/themoviedb/queries', () => ({
	getVideosOfMovie: jest.fn(),
}));

const MOVIEID: number = 123;

describe('[API] /movies/{idMovie}/videos', () => {
	it('GET - should return videos', async () => {
		const _results = [
			{
				id: '640cd15401432500e39b3055',
			},
		];

		(getVideosOfMovie as jest.Mock).mockResolvedValue({
			id: MOVIEID,
			results: _results,
		});

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: { idMovie: MOVIEID },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_results);
	});
	it('GET - should return 400', async () => {
		(getVideosOfMovie as jest.Mock).mockResolvedValue(undefined);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'idMovie is required' });
	});
	it('GET - should return 404', async () => {
		const _response = {
			success: false,
			status_code: 34,
			status_message: 'The resource you requested could not be found.',
		};

		(getVideosOfMovie as jest.Mock).mockResolvedValue(_response);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: { idMovie: MOVIEID },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.NOT_FOUND);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			message: `Cannot find videos of movie ${MOVIEID}`,
		});
	});
	it('GET - should return 500', async () => {
		(getVideosOfMovie as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Impossible to get videos of movie' });
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
