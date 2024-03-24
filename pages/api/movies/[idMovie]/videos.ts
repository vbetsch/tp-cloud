import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../../src/types/HttpMethods';
import { getVideosOfMovie, ResponseVideosOfMovie } from '../../../../src/queries/themoviedb/queries';

/**
 * @swagger
 * /api/movies/{idMovie}/videos:
 *   get:
 *     description: Returns videos of movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: number
 *         description: ID movie
 *     responses:
 *       200:
 *         description: Success Response
 *       404:
 *         description: Cannot find videos of movie {idMovie}
 *       500:
 *         description: Impossible to get videos of movie
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const idMovie: number = parseInt(req.query.idMovie as string, 10);

	let errorMessage: string;
	let response: ResponseVideosOfMovie;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				response = await getVideosOfMovie(idMovie);
			} catch (e) {
				const errorMessage: string = 'Impossible to get videos of movie';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ error: errorMessage });
			}

			if (!response.results) {
				const errorMessage: string = `Cannot find videos of movie ${idMovie}`;
				console.warn('WARN: ' + errorMessage);
				return res.status(404).json({ status: 404, message: errorMessage });
			}

			return res.status(200).json(response.results);
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(405).json({ error: errorMessage });
	}
}
