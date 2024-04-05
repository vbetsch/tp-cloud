import { NextApiRequest, NextApiResponse } from 'next';
import { getVideosOfMovie } from '../../../../src/queries/themoviedb/queries';
import { HttpCodeStatus } from '../../../../src/types/http/HttpCodeStatus';
import { HttpMethods } from '../../../../src/types/http/HttpMethods';
import { ResponseVideosOfMovie } from '../../../../src/types/themoviedb/queries/ResponseVideosOfMovie';

/**
 * @swagger
 * /movies/{idMovie}/videos:
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
 *       400:
 *         description: idMovie is required
 *       404:
 *         description: Cannot find videos of movie {idMovie}
 *       500:
 *         description: Impossible to get videos of movie
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const idMovie: number = parseInt(req.query.idMovie as string, 10);

	let warnMessage: string;
	let errorMessage: string;
	let response: ResponseVideosOfMovie;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				response = await getVideosOfMovie(idMovie);
			} catch (e) {
				errorMessage = 'Impossible to get videos of movie';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			if (!response) {
				errorMessage = 'idMovie is required';
				console.error('ERROR: ' + errorMessage);
				return res.status(HttpCodeStatus.BAD_REQUEST).json({ error: errorMessage });
			}

			if (!response.results) {
				warnMessage = `Cannot find videos of movie ${idMovie}`;
				console.warn('WARN: ' + warnMessage);
				return res.status(HttpCodeStatus.NOT_FOUND).json({ message: warnMessage });
			}

			return res.status(HttpCodeStatus.OK).json(response.results);
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(HttpCodeStatus.METHOD_NOT_ALLOWED).json({ error: errorMessage });
	}
}
