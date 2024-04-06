import handler from '../../../../pages/api/movies/[idMovie]/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMovieById } from '../../../../src/queries/themoviedb';
import { createMocks } from 'node-mocks-http';
import { expect, it } from '@jest/globals';
import { HttpMethods } from '../../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../../src/types/http/HttpCodeStatus';
import { findOneLikeById } from '../../../../src/queries/mongodb/likes';

jest.mock('../../../../src/queries/themoviedb', () => ({
	getMovieById: jest.fn(),
}));
jest.mock('../../../../src/queries/mongodb/likes', () => ({
	findOneLikeById: jest.fn(),
}));

const MOVIEID: number = 123;
const COUNTERLIKE: number = 5;

describe('[API] /movies/{idMovie}', () => {
	it('GET - should return movie with likes', async () => {
		const _like = {
			idTMDB: MOVIEID,
			likeCounter: COUNTERLIKE,
		};

		(getMovieById as jest.Mock).mockResolvedValue({
			id: MOVIEID,
		});
		(findOneLikeById as jest.Mock).mockResolvedValue(_like);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: { idMovie: MOVIEID },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			id: 123,
			likes: 5,
		});
	});
	it('GET - should return 400', async () => {
		(getMovieById as jest.Mock).mockResolvedValue(undefined);
		(findOneLikeById as jest.Mock).mockResolvedValue(undefined);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'idMovie is required' });
	});
	it('GET - should return 404', async () => {
		(getMovieById as jest.Mock).mockResolvedValue({
			success: false,
			status_code: 34,
			status_message: 'The resource you requested could not be found.',
		});
		(findOneLikeById as jest.Mock).mockResolvedValue(null);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: { idMovie: MOVIEID },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.NOT_FOUND);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ message: 'Movie not found' });
	});
	it('GET - should return 500 for getMovieById error', async () => {
		(getMovieById as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Impossible to get movie' });
	});
	it('GET - should return 500 for findOneLikeById error', async () => {
		(getMovieById as jest.Mock).mockResolvedValue({
			id: MOVIEID,
		});
		(findOneLikeById as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Impossible to find like' });
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
