import { NextApiRequest, NextApiResponse } from 'next';
import { getMoviesDiscover } from '../../../src/queries/TheMovieDbQueries';

/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Returns movies to discover
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: number
 *         description: Page number
 *     responses:
 *       200:
 *         description: Success Response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const page: number = parseInt(req.query.page as string, 10) || 1;

	try {
		return res.status(200).json(await getMoviesDiscover(page));
	} catch (e) {
		const errorMessage: string = 'Unable to search movies to discover';
		console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
		return res.status(500).json({ error: errorMessage });
	}
}
