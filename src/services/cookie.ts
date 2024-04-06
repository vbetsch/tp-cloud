import { CookieSerializeOptions, serialize } from 'cookie';

const OPTIONS: CookieSerializeOptions = {
	httpOnly: true,
	maxAge: 60 * 60 * 24 * 7, // One week
	path: '/',
};

const createCookie = (token: string): string => {
	return serialize('session', token, OPTIONS);
};

export { createCookie };
