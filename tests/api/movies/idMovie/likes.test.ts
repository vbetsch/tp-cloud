import { createMocks } from 'node-mocks-http';
import handler from '../../../../pages/api/movies/[idMovie]/likes';
import { NextApiRequest, NextApiResponse } from 'next';
import { findOneLikeById, insertOneLike, updateOneLikeById } from '../../../../src/queries/mongodb/queries';
import { ObjectId } from 'bson';
import { expect, it } from '@jest/globals';

jest.mock('../../../../src/queries/mongodb/queries', () => ({
	findOneLikeById: jest.fn(),
	updateOneLikeById: jest.fn(),
	insertOneLike: jest.fn(),
}));

describe('[API] /movies/{idMovie}/likes', () => {
	it('GET - should return 400', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue(undefined);

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({ error: 'idMovie is required' });
	});
	it('GET - should return null', async () => {
		const movieId: number = 41;

		(findOneLikeById as jest.Mock).mockResolvedValue(null);

		const { req, res } = createMocks({
			method: 'GET',
			query: { idMovie: movieId },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();

		const responseData = res._getJSONData();
		expect(responseData).toBe(null);
	});
	it('GET - should return like of movie', async () => {
		const movieId: number = 123;
		const counterLike: number = 5;
		const _like = {
			idTMDB: movieId,
			likeCounter: counterLike,
		};

		(findOneLikeById as jest.Mock).mockResolvedValue(_like);

		const { req, res } = createMocks({
			method: 'GET',
			query: { idMovie: movieId },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(200);
		expect(res._isEndCalled()).toBeTruthy();

		const responseData = res._getJSONData();
		expect(responseData).toStrictEqual(_like);
	});
	it('GET - should return 500 for findOneLikeById error', async () => {
		(findOneLikeById as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: 'GET',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to get likes' });
	});
	it('PATCH - should return 400', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue(undefined);

		const { req, res } = createMocks({
			method: 'PATCH',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(400);
		expect(res._getJSONData()).toStrictEqual({ error: 'idMovie is required' });
	});
	it('PATCH - should return like created', async () => {
		const _idMovie: number = 456;

		(findOneLikeById as jest.Mock).mockResolvedValue(null);
		(insertOneLike as jest.Mock).mockResolvedValue({
			acknowledged: true,
			insertedId: new ObjectId('65fd8379baa9ac351e715755'),
		});

		const { req, res } = createMocks({
			method: 'PATCH',
			query: {
				idMovie: _idMovie,
				action: 'like',
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(201);
		expect(res._isEndCalled()).toBeTruthy();

		const responseData = res._getJSONData();
		expect(responseData).toStrictEqual({
			action: 'likeCounter created',
			insertedId: '65fd8379baa9ac351e715755',
			idMovie: _idMovie,
		});
	});
	it('PATCH - should return like incremented', async () => {
		const _idMovie: number = 123;
		const _originalCounterValue: number = 5;
		const _like = {
			idTMDB: _idMovie,
			likeCounter: _originalCounterValue,
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
			method: 'PATCH',
			query: {
				idMovie: _idMovie,
				action: 'like',
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(201);
		expect(res._isEndCalled()).toBeTruthy();

		const responseData = res._getJSONData();
		expect(responseData).toStrictEqual({
			action: 'likeCounter incremented',
			idMovie: _idMovie,
			previousValue: _originalCounterValue,
			newValue: _originalCounterValue + 1,
		});
	});
	it('PATCH - should return 400', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue({});

		const { req, res } = createMocks({
			method: 'PATCH',
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(400);
		expect(res._isEndCalled()).toBeTruthy();

		const responseData = res._getJSONData();
		expect(responseData).toStrictEqual({
			error: "Parameter 'action' is required",
		});
	});
	it('PATCH - should return 405 if action is not allowed', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue({});

		const { req, res } = createMocks({
			method: 'PATCH',
			query: {
				action: 'azerty',
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res.statusCode).toBe(405);
		expect(res._isEndCalled()).toBeTruthy();

		const responseData = res._getJSONData();
		expect(responseData).toStrictEqual({
			error: 'Action not allowed',
		});
	});
	it('PATCH - should return 500 for findOneLikeById error', async () => {
		(findOneLikeById as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: 'PATCH',
			query: {
				action: 'like',
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to search movie' });
	});
	it('PATCH - should return 500 for updateOneLikeById error', async () => {
		const _idMovie: number = 123;
		const _originalCounterValue: number = 5;
		const _like = {
			idTMDB: _idMovie,
			likeCounter: _originalCounterValue,
		};

		(updateOneLikeById as jest.Mock).mockRejectedValue(new Error('TEST'));
		(findOneLikeById as jest.Mock).mockResolvedValue(_like);

		const { req, res } = createMocks({
			method: 'PATCH',
			query: {
				idMovie: _idMovie,
				action: 'like',
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to update like' });
	});
	it('PATCH - should return 500 for insertOneLike error', async () => {
		(findOneLikeById as jest.Mock).mockResolvedValue(null);
		(insertOneLike as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: 'PATCH',
			query: { action: 'like' },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(500);
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to insert like' });
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
