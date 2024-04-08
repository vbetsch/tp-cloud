import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { JwtPayload } from 'jsonwebtoken';
import { verifyJwt } from '../../../src/services/jsonwebtoken';

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     tags: [Auth]
 *     description: Get user authenticated
 *     responses:
 *       200:
 *         description: Success response
 *       500:
 *         description: Unable to verify token
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const token: string | undefined = req.cookies.session;

	let errorMessage: string;
	let result: JwtPayload | string;
	switch (req.method) {
		case HttpMethods.GET:
			if (!token) {
				return res.status(HttpCodeStatus.OK).json({ user: null });
			}

			try {
				result = await verifyJwt(token);
			} catch (e) {
				const errorMessage: string = 'Unable to verify token';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			return res.status(HttpCodeStatus.OK).json({ user: result });
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(HttpCodeStatus.METHOD_NOT_ALLOWED).json({ error: errorMessage });
	}
}
