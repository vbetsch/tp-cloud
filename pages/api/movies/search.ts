import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/HttpMethods';
import { getSearchMovies, ResponsePaginatedMovies } from '../../../src/queries/themoviedb/queries';

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     description: Search a movie
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search input
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
 *         description: Internal Server Error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const query: string = (req.query.query as string) || '';
	const page: number = parseInt(req.query.page as string, 10) || 1;

	let errorMessage: string;
	let response: ResponsePaginatedMovies;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				response = await getSearchMovies(query, page);
			} catch (e) {
				const errorMessage: string = 'Internal Server Error';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ status: 500, error: errorMessage });
			}

			if (response.results && !response.results.length) {
				errorMessage = 'No movie was found';
				console.warn('WARN: ' + errorMessage);
				return res.status(404).json({ message: errorMessage });
			}

			return res.status(200).json(response);
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(405).json({ error: errorMessage });
	}
}
