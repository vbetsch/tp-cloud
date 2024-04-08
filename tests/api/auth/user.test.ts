import { describe, expect, it } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import handler from '../../../pages/api/auth/user';
import { verifyJwt } from '../../../src/services/jsonwebtoken';
import { UserType } from '../../../src/types/mongodb/UserType';
import { JwtPayload } from 'jsonwebtoken';

jest.mock('../../../src/services/jsonwebtoken', () => ({
	verifyJwt: jest.fn(),
}));

const USER: UserType = {
	email: 'test@example.com',
	password: 'test',
};
const JWT_PAYLOAD: JwtPayload = { ...USER, iat: 1712610070 };

describe('[API] /auth/user', () => {
	it('GET - should return 200 - no user', async () => {
		const { req, res } = createMocks({
			method: HttpMethods.GET,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ user: null });
	});
	it('GET - should return 200 - with user', async () => {
		(verifyJwt as jest.Mock).mockResolvedValue(JWT_PAYLOAD);

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			cookies: {
				session:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJoYXNoUGFzc3dvcmQiOiIkMmIkMTAkVmZ1a3BrT0J6QVVuVlh0aUdTSnZPLjhZTHZpWlJNSHFsM2ZIVzh2TG9BRi9TVXRlWmdPcW0iLCJpYXQiOjE3MTI1MjM5MTJ9.lrSorJWJ_R2hOcFBC_3kYabaWsj7Ll8DbVqyUu7RDRI',
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ user: JWT_PAYLOAD });
	});
	it('GET - should return 500', async () => {
		(verifyJwt as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.GET,
			cookies: {
				session:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJoYXNoUGFzc3dvcmQiOiIkMmIkMTAkVmZ1a3BrT0J6QVVuVlh0aUdTSnZPLjhZTHZpWlJNSHFsM2ZIVzh2TG9BRi9TVXRlWmdPcW0iLCJpYXQiOjE3MTI1MjM5MTJ9.lrSorJWJ_R2hOcFBC_3kYabaWsj7Ll8DbVqyUu7RDRI',
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to verify token' });
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
