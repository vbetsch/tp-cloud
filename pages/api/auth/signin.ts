import { UserType } from '../../../src/types/mongodb/UserType';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { signJwt } from '../../../src/services/jsonwebtoken';
import { hashString } from '../../../src/services/bcrypt';
import { createCookie } from '../../../src/services/cookie';

interface SignInBodyRequest extends UserType {
	remember: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const { email, password, remember }: SignInBodyRequest = req.body;

	let errorMessage: string;
	let hashPassword: string;
	let token: string;
	let cookie: string;
	switch (req.method) {
		case HttpMethods.POST:
			if (!email || !password) {
				errorMessage = "Parameters 'email' and 'password' are required";
				console.error('ERROR: ' + errorMessage);
				return res.status(HttpCodeStatus.BAD_REQUEST).json({ error: errorMessage });
			}

			hashPassword = hashString(password);

			try {
				token = signJwt('SECRET_JWT', { email, hashPassword });
			} catch (e) {
				const errorMessage: string = 'Unable to create jwt';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			if (!remember) {
				return res.status(HttpCodeStatus.OK).json({ token });
			} else {
				try {
					cookie = createCookie(token);
					res.setHeader('Set-Cookie', cookie);
				} catch (e) {
					const errorMessage: string = 'Unable to create jwt';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
				}
				return res.status(HttpCodeStatus.OK).json({ token, cookie });
			}

		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(HttpCodeStatus.METHOD_NOT_ALLOWED).json({ error: errorMessage });
	}
}
