import { createMocks } from 'node-mocks-http';
import handler, { LikesActions } from '../../../../pages/api/movies/[idMovie]/likes';
import { NextApiRequest, NextApiResponse } from 'next';
import { expect, it } from '@jest/globals';
import { HttpMethods } from '../../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../../src/types/http/HttpCodeStatus';
import { findOneLikeById, insertOneLike, updateOneLikeById } from '../../../../src/queries/mongodb/likes';

jest.mock('../../../../src/queries/mongodb/likes', () => ({
	findOneLikeById: jest.fn(),
	updateOneLikeById: jest.fn(),
	insertOneLike: jest.fn(),
}));

const MOVIEID: number = 123;
const COUNTERLIKE: number = 5;

describe('[API] /movies/{idMovie}/likes', () => {
	it('GET - should return 400', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue(undefined);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'idMovie is required' });
	});
	it('GET - should return null', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue(null);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: { idMovie: MOVIEID },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toBe(null);
	});
	it('GET - should return like of movie', async () => {
		const _like = {
			idTMDB: MOVIEID,
			likeCounter: COUNTERLIKE,
		};

		(findOneLikeById as jest.Mock).mockResolvedValue(_like);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			query: { idMovie: MOVIEID },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_like);
	});
	it('GET - should return 500 for findOneLikeById error', async () => {
		(findOneLikeById as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to get likes' });
	});
	it('PATCH - should return 400', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue(undefined);

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'idMovie is required' });
	});
	it('PATCH - should return like created', async () => {
		const _idLike: string = '65fd8379baa9ac351e715755';

		(findOneLikeById as jest.Mock).mockResolvedValue(null);
		(insertOneLike as jest.Mock).mockResolvedValue({
			acknowledged: true,
			insertedId: _idLike,
		});

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
			query: {
				idMovie: MOVIEID,
				action: LikesActions.LIKE,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.CREATED);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			action: 'likeCounter created',
			insertedId: _idLike,
			idMovie: MOVIEID,
		});
	});
	it('PATCH - should return like incremented - like', async () => {
		const _like = {
			idTMDB: MOVIEID,
			likeCounter: COUNTERLIKE,
		};

		(findOneLikeById as jest.Mock).mockResolvedValue(_like);
		(updateOneLikeById as jest.Mock).mockResolvedValue({
			acknowledged: true,
			modifiedCount: 1,
			upsertedId: null,
			upsertedCount: 0,
			matchedCount: 1,
		});

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
			query: {
				idMovie: MOVIEID,
				action: LikesActions.LIKE,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.CREATED);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			action: 'likeCounter incremented',
			idMovie: MOVIEID,
			previousValue: COUNTERLIKE,
			newValue: COUNTERLIKE + 1,
		});
	});
	it('PATCH - should return like incremented - unlike', async () => {
		const _like = {
			idTMDB: MOVIEID,
			likeCounter: COUNTERLIKE,
		};

		(findOneLikeById as jest.Mock).mockResolvedValue(_like);
		(updateOneLikeById as jest.Mock).mockResolvedValue({
			acknowledged: true,
			modifiedCount: 1,
			upsertedId: null,
			upsertedCount: 0,
			matchedCount: 1,
		});

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
			query: {
				idMovie: MOVIEID,
				action: LikesActions.UNLIKE,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.CREATED);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			action: 'likeCounter incremented',
			idMovie: MOVIEID,
			previousValue: COUNTERLIKE,
			newValue: COUNTERLIKE - 1,
		});
	});
	it('PATCH - should return 400', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue({});

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			error: "Parameter 'action' is required",
		});
	});
	it('PATCH - should return 405 if action is not allowed', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue({});

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
			query: {
				action: 'azerty',
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(HttpCodeStatus.METHOD_NOT_ALLOWED);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			error: 'Action not allowed',
		});
	});
	it('PATCH - should return 500 for findOneLikeById error', async () => {
		(findOneLikeById as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
			query: {
				action: LikesActions.LIKE,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to search movie' });
	});
	it('PATCH - should return 500 for updateOneLikeById error', async () => {
		const _like = {
			idTMDB: MOVIEID,
			likeCounter: COUNTERLIKE,
		};

		(updateOneLikeById as jest.Mock).mockRejectedValue(new Error('TEST'));
		(findOneLikeById as jest.Mock).mockResolvedValue(_like);

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
			query: {
				idMovie: MOVIEID,
				action: LikesActions.LIKE,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to update like' });
	});
	it('PATCH - should return 500 for insertOneLike error', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue(null);
		(insertOneLike as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.PATCH,
			query: { action: LikesActions.LIKE },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to insert like' });
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
