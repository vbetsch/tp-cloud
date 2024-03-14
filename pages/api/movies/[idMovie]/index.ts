import { NextApiRequest, NextApiResponse } from 'next';
import { MovieDetailsType } from '../../../../src/types/themoviedb/MovieTypes';
import { LikeType } from '../../../../src/types/firebase/LikeType';
import { HttpMethods } from '../../../../src/types/HttpMethods';
import { getMovieById } from '../../../../src/queries/TheMovieDbQueries';
import { findOneLikeById } from '../../../../src/queries/FirebaseQueries';

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
 *         description: Movie not found
 *       500:
 *         description: Unable to find a movie by id
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
				errorMessage = 'Movie not found';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(404).json({ error: errorMessage });
			}

			try {
				like = await findOneLikeById(idMovie);
			} catch (e) {
				errorMessage = 'Unable to find a movie by id';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ error: errorMessage });
			}

			movie.likes = like && like.likeCounter ? like.likeCounter : 0;
			return res.status(200).json(movie);
		default:
			errorMessage = 'Method Not Allowed';
			console.error(`ERROR: ${errorMessage}`);
			return res.status(405).json({ error: errorMessage });
	}
}
