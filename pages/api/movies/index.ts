import { NextApiRequest, NextApiResponse } from 'next';
import { HttpCodeStatus } from '../../../src/types/http/HttpCodeStatus';
import { HttpMethods } from '../../../src/types/http/HttpMethods';
import { ResponsePaginatedMovies } from '../../../src/types/themoviedb/queries/ResponsePaginatedMovies';
import { getMoviesDiscover } from '../../../src/queries/themoviedb';

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags: [Movies]
 *     description: Returns movies to discover
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *         description: Page number
 *     responses:
 *       200:
 *         description: Success Response
 *       500:
 *         description: Unable to search movies to discover
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const page: number = parseInt(req.query.page as string, 10) || 1;

	let errorMessage: string;
	let response: ResponsePaginatedMovies;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				response = await getMoviesDiscover(page);
			} catch (e) {
				const errorMessage: string = 'Unable to search movies to discover';
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
