import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../types/HttpMethods';
import { getMovieById } from '../../../queries/TheMovieDbQueries';
import { findOneLikeById } from '../../../queries/FirebaseQueries';
import { MovieDetailsType } from '../../../types/themoviedb/MovieTypes';
import { LikeType } from '../../../types/firebase/LikeType';

interface MovieOutputType extends MovieDetailsType {
	likes?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const idMovie: number = parseInt(req.query.idMovie as string, 10);

	let movie: MovieOutputType | undefined;
	let like: LikeType | undefined | null;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				movie = await getMovieById(idMovie);
				if (!movie) {
					res.status(404).json({ status: 404, error: 'Not Found' });
					return;
				}
			} catch (e) {
				res.status(500).json({ status: 500, error: e });
				return;
			}

			try {
				like = await findOneLikeById(idMovie);
			} catch (e) {
				res.status(500).json({ status: 500, error: e });
			}

			if (like && like.likeCounter) {
				movie.likes = like.likeCounter;
			} else {
				movie.likes = 0;
			}

			res.json({ status: 200, data: { movie } });
			break;
		default:
			res.status(405).json({ status: 405, error: 'Method Not Allowed' });
			break;
	}
}
