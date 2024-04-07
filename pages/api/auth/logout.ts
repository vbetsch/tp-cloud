import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { createInvalidCookie } from '../../../src/services/cookie';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     description: Log out
 *     responses:
 *       200:
 *         description: You have been successfully disconnected
 *       500:
 *         description: Unable to delete cookie
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	let errorMessage: string;
	let cookie: string;
	switch (req.method) {
		case HttpMethods.POST:
			try {
				cookie = await createInvalidCookie();
			} catch (e) {
				const errorMessage: string = 'Unable to delete cookie';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}
			res.setHeader('Set-Cookie', cookie);
			return res.status(HttpCodeStatus.OK).json({ message: 'You have been successfully disconnected' });
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(HttpCodeStatus.METHOD_NOT_ALLOWED).json({ error: errorMessage });
	}
}
