import { describe, expect, it } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import handler from '../../../pages/api/auth/signup';
import { hashString } from '../../../src/services/bcrypt';
import { createUser, findUserByEmail } from '../../../src/queries/mongodb/users';
import { UserType } from '../../../src/types/mongodb/UserType';

jest.mock('../../../src/services/bcrypt', () => ({
	hashString: jest.fn(),
}));
jest.mock('../../../src/queries/mongodb/users', () => ({
	findUserByEmail: jest.fn(),
	createUser: jest.fn(),
}));

const USER_INPUT: UserType = {
	email: 'test@example.com',
	password: 'test',
};
const BAD_REQUEST_ERROR = {
	error: "Parameters 'email' and 'password' are required",
};
const HASH_PASSWORD: string = '$2b$10$kLz245NL/LjhgVmpHhhgFuzc6EWKi0YxkV0kQ0sC44PfZmdsFtHSe'; // hash of 'test'

describe('[API] /auth/signup', () => {
	it('POST - should return 200', async () => {
		const _result = {
			acknowledged: true,
			insertedId: '6612fd49bbbea0ba044c941e',
		};

		(hashString as jest.Mock).mockResolvedValue(HASH_PASSWORD);
		(findUserByEmail as jest.Mock).mockResolvedValue(null);
		(createUser as jest.Mock).mockResolvedValue(_result);

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER_INPUT,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(_result);
	});
	it('POST - no params should return 400', async () => {
		const { req, res } = createMocks({
			method: HttpMethods.POST,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(BAD_REQUEST_ERROR);
	});
	it('POST - only email should return 400', async () => {
		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: {
				email: USER_INPUT.email,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(BAD_REQUEST_ERROR);
	});
	it('POST - only password should return 400', async () => {
		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: {
				password: USER_INPUT.password,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(BAD_REQUEST_ERROR);
	});
	it('POST - account exist should return 401', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(USER_INPUT);

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER_INPUT,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.UNAUTHORIZED);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			error: 'An account is already linked to this email address',
		});
	});
	it('POST - findUserByEmail error should return 500', async () => {
		(findUserByEmail as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER_INPUT,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to find user' });
	});
	it('POST - hashString error should return 500', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(null);
		(hashString as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER_INPUT,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to hash password' });
	});
	it('POST - createUser error should return 500', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(null);
		(hashString as jest.Mock).mockResolvedValue(HASH_PASSWORD);
		(createUser as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER_INPUT,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to create user' });
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
