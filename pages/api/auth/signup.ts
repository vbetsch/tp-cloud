import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { createUser } from '../../../src/queries/mongodb/users';
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
 *       500:
 *         description: Unable to create user
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const { email, password }: UserType = req.body;

	let errorMessage: string;
	let response: InsertOneResult;
	switch (req.method) {
		case HttpMethods.POST:
			if (!email || !password) {
				errorMessage = "Parameters 'email' and 'password' are required";
				console.error('ERROR: ' + errorMessage);
				return res.status(HttpCodeStatus.BAD_REQUEST).json({ error: errorMessage });
			}

			try {
				response = await createUser({
					email,
					password: hashString(password),
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
