import { UserType } from '../../../src/types/mongodb/UserType';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { signJwt } from '../../../src/services/jsonwebtoken';
import { createOneWeekCookie } from '../../../src/services/cookie';
import { findUserByEmail } from '../../../src/queries/mongodb/users';
import { compareHash } from '../../../src/services/bcrypt';

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
 *       401:
 *         description: The information you have entered does not correspond to any user
 *       500:
 *         description: Internal Server Error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const { email, password, remember }: SignInBodyRequest = req.body;

	let errorMessage: string;
	let userFound: UserType | null;
	let userValid: boolean;
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
				userFound = await findUserByEmail(email);
			} catch (e) {
				const errorMessage: string = 'Unable to find user';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			if (userFound === null) {
				errorMessage = 'The information you have entered does not correspond to any user';
				console.error('ERROR: ' + errorMessage);
				return res.status(HttpCodeStatus.UNAUTHORIZED).json({ error: errorMessage });
			}

			try {
				userValid = await compareHash(password, userFound.password);
			} catch (e) {
				const errorMessage: string = 'Unable to compare hash';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			if (!userValid) {
				errorMessage = 'The information you have entered does not correspond to any user';
				console.error('ERROR: ' + errorMessage);
				return res.status(HttpCodeStatus.UNAUTHORIZED).json({ error: errorMessage });
			}

			try {
				token = await signJwt(userFound);
			} catch (e) {
				const errorMessage: string = 'Unable to create jwt';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			if (!remember) {
				return res.status(HttpCodeStatus.OK).json({ userData: userFound, token });
			} else {
				try {
					cookie = await createOneWeekCookie(token);
				} catch (e) {
					const errorMessage: string = 'Unable to create cookie';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
				}
				res.setHeader('Set-Cookie', cookie);
				return res.status(HttpCodeStatus.OK).json({ userData: userFound, token, cookie });
			}

		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(HttpCodeStatus.METHOD_NOT_ALLOWED).json({ error: errorMessage });
	}
}
