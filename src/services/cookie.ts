import { CookieSerializeOptions, serialize } from 'cookie';

const COOKIE_NAME = 'session';
const OPTIONS: CookieSerializeOptions = {
	httpOnly: true,
	path: '/',
};

const createOneWeekCookie = async (token: string): Promise<string> => {
	return serialize(COOKIE_NAME, token, {
		...OPTIONS,
		maxAge: 60 * 60 * 24 * 7, // One week
	});
};

const createInvalidCookie = async (): Promise<string> => {
	return serialize(COOKIE_NAME, '', {
		...OPTIONS,
		maxAge: -1,
	});
};

export { createOneWeekCookie, createInvalidCookie };
