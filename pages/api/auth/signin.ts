import { UserType } from '../../../src/types/mongodb/UserType';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { signJwt } from '../../../src/services/jsonwebtoken';
import { hashString } from '../../../src/services/bcrypt';
import { createOneWeekCookie } from '../../../src/services/cookie';

interface SignInBodyRequest extends UserType {
	remember: boolean;
}

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     tags: [Auth]
 *     description: Log in a new user
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - in: body
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: john@scott.com
 *         description: Email of new user
 *       - in: body
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *           example: j0hnSc0tt
 *         description: Password of new user
 *       - in: body
 *         name: remember
 *         required: false
 *         schema:
 *           type: boolean
 *           example: 'false'
 *         description: Enable if you accept cookies
 *     responses:
 *       200:
 *         description: Success Response
 *       400:
 *         description: Parameters 'email' and 'password' are required
 *       500:
 *         description: Internal Server Error
 */
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

			try {
				hashPassword = await hashString(password);
			} catch (e) {
				const errorMessage: string = 'Unable to hash password';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

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
					cookie = createOneWeekCookie(token);
				} catch (e) {
					const errorMessage: string = 'Unable to create cookie';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
				}
				res.setHeader('Set-Cookie', cookie);
				return res.status(HttpCodeStatus.OK).json({ token, cookie });
			}

		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(HttpCodeStatus.METHOD_NOT_ALLOWED).json({ error: errorMessage });
	}
}
