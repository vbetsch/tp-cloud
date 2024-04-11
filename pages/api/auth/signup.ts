import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { createUser, findUserByEmail } from '../../../src/queries/mongodb/users';
import { UserType } from '../../../src/types/mongodb/UserType';
import { InsertOneResult } from 'mongodb';
import { hashString } from '../../../src/services/bcrypt';

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     description: Create a new user
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
 *     responses:
 *       200:
 *         description: Success Response
 *       400:
 *         description: Parameters 'email' and 'password' are required
 *       401:
 *         description: An account is already linked to this email address
 *       500:
 *         description: Internal Server Error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const { email, password }: UserType = req.body;

	let errorMessage: string;
	let hashPassword: string;
	let response: InsertOneResult;
	let userFound: UserType | null;
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

			try {
				hashPassword = await hashString(password);
			} catch (e) {
				const errorMessage: string = 'Unable to hash password';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			if (userFound !== null) {
				errorMessage = 'An account is already linked to this email address';
				console.error('ERROR: ' + errorMessage);
				return res.status(HttpCodeStatus.UNAUTHORIZED).json({ error: errorMessage });
			}

			try {
				response = await createUser({
					email,
					password: hashPassword,
				});
			} catch (e) {
				const errorMessage: string = 'Unable to create user';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			return res.status(HttpCodeStatus.OK).json(response);
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(HttpCodeStatus.METHOD_NOT_ALLOWED).json({ error: errorMessage });
	}
}
