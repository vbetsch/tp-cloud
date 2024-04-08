import { describe, expect, it } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import handler from '../../../pages/api/auth/signin';
import { compareHash } from '../../../src/services/bcrypt';
import { UserType } from '../../../src/types/mongodb/UserType';
import { signJwt } from '../../../src/services/jsonwebtoken';
import { createOneWeekCookie } from '../../../src/services/cookie';
import { findUserByEmail } from '../../../src/queries/mongodb/users';

jest.mock('../../../src/queries/mongodb/users', () => ({
	findUserByEmail: jest.fn(),
}));
jest.mock('../../../src/services/bcrypt', () => ({
	compareHash: jest.fn(),
}));
jest.mock('../../../src/services/jsonwebtoken', () => ({
	signJwt: jest.fn(),
}));
jest.mock('../../../src/services/cookie', () => ({
	createOneWeekCookie: jest.fn(),
}));

const USER: UserType = {
	email: 'test@example.com',
	password: 'test',
};
const BAD_REQUEST_ERROR = {
	error: "Parameters 'email' and 'password' are required",
};
const TOKEN: string =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJoYXNoUGFzc3dvcmQiOiIkMmIkMTAkVmZ1a3BrT0J6QVVuVlh0aUdTSnZPLjhZTHZpWlJNSHFsM2ZIVzh2TG9BRi9TVXRlWmdPcW0iLCJpYXQiOjE3MTI1MjM5MTJ9.lrSorJWJ_R2hOcFBC_3kYabaWsj7Ll8DbVqyUu7RDRI';
// token of USER
const COOKIE: string =
	'session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJoYXNoUGFzc3dvcmQiOiIkMmIkMTAkT0t1QkZjbzlpQVdwSHdsTVFRQThuLnFNLmVENFoxd1pFVmhQZVJlR0FXUi5tdXJnNTlLVFMiLCJpYXQiOjE3MTI1MjQyNjh9.kImdsoLxeGOKeRCmn8tgUrtdr93ZGEusL3Ktoha-dOg; Max-Age=604800; Path=/; HttpOnly';
// cookie of TOKEN

describe('[API] /auth/signin', () => {
	it('POST - should return 200 without cookie - no remember', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(USER);
		(compareHash as jest.Mock).mockResolvedValue(true);
		(signJwt as jest.Mock).mockResolvedValue(TOKEN);

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ token: TOKEN });
	});
	it('POST - should return 200 without cookie - remember false', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(USER);
		(compareHash as jest.Mock).mockResolvedValue(true);
		(signJwt as jest.Mock).mockResolvedValue(TOKEN);

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: {
				...USER,
				remember: false,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ token: TOKEN });
	});
	it('POST - should return 200 with cookie', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(USER);
		(compareHash as jest.Mock).mockResolvedValue(true);
		(signJwt as jest.Mock).mockResolvedValue(TOKEN);
		(createOneWeekCookie as jest.Mock).mockResolvedValue(COOKIE);

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: {
				...USER,
				remember: true,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.OK);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ token: TOKEN, cookie: COOKIE });
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
			body: { email: USER.email },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(BAD_REQUEST_ERROR);
	});
	it('POST - only password should return 400', async () => {
		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: { password: USER.password },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(BAD_REQUEST_ERROR);
	});
	it('POST - email and remember should return 400', async () => {
		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: {
				email: USER.email,
				remember: true,
			},
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.BAD_REQUEST);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual(BAD_REQUEST_ERROR);
	});
	it('POST - invalid email should return 401', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(null);

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.UNAUTHORIZED);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			error: 'The information you have entered does not correspond to any user',
		});
	});
	it('POST - invalid passowrd should return 401', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(USER);
		(compareHash as jest.Mock).mockResolvedValue(false);

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.UNAUTHORIZED);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({
			error: 'The information you have entered does not correspond to any user',
		});
	});
	it('POST - findUserByEmail error should return 500', async () => {
		(findUserByEmail as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to find user' });
	});
	it('POST - compareHash error should return 500', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(USER);
		(compareHash as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to compare hash' });
	});
	it('POST - signJwt error should return 500', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(USER);
		(compareHash as jest.Mock).mockResolvedValue(true);
		(signJwt as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: USER,
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to create jwt' });
	});
	it('POST - createOneWeekCookie error should return 500', async () => {
		(findUserByEmail as jest.Mock).mockResolvedValue(USER);
		(compareHash as jest.Mock).mockResolvedValue(true);
		(signJwt as jest.Mock).mockResolvedValue(TOKEN);
		(createOneWeekCookie as jest.Mock).mockRejectedValue(new Error('TEST'));

		const { req, res } = createMocks({
			method: HttpMethods.POST,
			body: { ...USER, remember: true },
		});

		await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

		expect(res._getStatusCode()).toBe(HttpCodeStatus.INTERNAL_SERVER_ERROR);
		expect(res._isEndCalled()).toBeTruthy();
		expect(res._getJSONData()).toStrictEqual({ error: 'Unable to create cookie' });
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
