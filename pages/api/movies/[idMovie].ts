import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../types/HttpMethods';
import { FirebaseCollections, getFirebaseDatabase } from '../../../firebase';
import { getMovieById } from '../../../queries/TheMovieDbQueries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const idMovie = parseInt(req.query.idMovie as string, 10);

	const db = await getFirebaseDatabase();
	if (!db) {
		res.status(500).json({ status: 500, error: "Can't connect to database" });
	}

	let movie, likes;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				movie = await getMovieById(idMovie);
				if (!movie) {
					res.status(404).json({ status: 404, error: 'Not Found' });
				}
			} catch (e) {
				res.status(500).json({ status: 500, error: 'Internal Server Error' });
			}

			likes = await db?.collection(FirebaseCollections.LIKES).findOne({ idTMDB: idMovie });

			if (likes && likes.likeCounter) {
				movie.likes = likes.likeCounter;
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
