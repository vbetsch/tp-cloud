import { NextApiRequest, NextApiResponse } from 'next';
import { getMoviesDiscover, ResponsePaginatedMovies } from '../../../src/queries/TheMovieDbQueries';
import { HttpMethods } from '../../../src/types/HttpMethods';

/**
 * @swagger
 * /api/movies:
 *   get:
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
				return res.status(500).json({ error: errorMessage });
			}

			return res.status(200).json(response);
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(405).json({ error: errorMessage });
	}
}
