import { CookieSerializeOptions, serialize } from 'cookie';

const COOKIE_NAME = 'session';
const OPTIONS: CookieSerializeOptions = {
	httpOnly: true,
	path: '/',
};

const createOneWeekCookie = (token: string): string => {
	return serialize(COOKIE_NAME, token, {
		...OPTIONS,
		maxAge: 60 * 60 * 24 * 7, // One week
	});
};

const createInvalidCookie = (): string => {
	return serialize(COOKIE_NAME, '', {
		...OPTIONS,
		maxAge: -1,
	});
};

export { createOneWeekCookie, createInvalidCookie };
