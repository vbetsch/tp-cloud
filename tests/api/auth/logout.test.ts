import { describe, expect, it } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import handler from '../../../pages/api/auth/logout';
import { createInvalidCookie } from '../../../src/services/cookie';

jest.mock('../../../src/services/cookie', () => ({
	createInvalidCookie: jest.fn(),
}));

const COOKIE: string = 'session=; Max-Age=-1; Path=/; HttpOnly';

describe('[API] /auth/logout', () => {
	it('POST - should return 200', async () => {
		(createInvalidCookie as jest.Mock).mockResolvedValue(COOKIE);

		const { req, res } = createMocks({
			method: HttpMethods.POST,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ message: 'You have been successfully disconnected' });
	});
	it('POST - should return 500', async () => {
		(createInvalidCookie as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.POST,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to delete cookie' });
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
