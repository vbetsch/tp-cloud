import { NextApiRequest, NextApiResponse } from 'next';
import { MovieDetailsType } from '../../../../src/types/themoviedb/MovieTypes';
import { LikeType } from '../../../../src/types/mongodb/LikeType';
import { HttpMethods } from '../../../../src/types/HttpMethods';
import { findOneLikeById } from '../../../../src/queries/mongodb/queries';
import { getMovieById } from '../../../../src/queries/themoviedb/queries';

interface MovieOutputType extends MovieDetailsType {
	likes?: number;
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     description: Returns movie by given id
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
 *         description: Error Response
 *       500:
 *         description: Internal Server Error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const idMovie: number = parseInt(req.query.idMovie as string, 10);

	let movie: MovieOutputType;
	let like: LikeType | undefined | null;
	let errorMessage: string;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				movie = await getMovieById(idMovie);
			} catch (e) {
				errorMessage = 'Internal Server Error';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ error: errorMessage });
			}

			try {
				like = await findOneLikeById(idMovie);
			} catch (e) {
				errorMessage = 'Internal Server Error';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ error: errorMessage });
			}

			movie.likes = like && like.likeCounter ? like.likeCounter : 0;

			if (!movie.id) {
				return res.status(404).json(movie);
			}

			return res.status(200).json(movie);
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(405).json({ error: errorMessage });
	}
}
