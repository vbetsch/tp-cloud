import { ConfigService } from '../../../services/config.service';
import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../types/HttpMethods';
import { FirebaseCollections, getFirebaseDatabase } from '../../../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const idMovie = parseInt(req.query.idMovie as string, 10);
	const url = `${ConfigService.THEMOVIEDB.BASEURL}${ConfigService.THEMOVIEDB.URIS.MOVIE}/${idMovie}`;
	const options = {
		method: HttpMethods.GET,
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${process.env.API_TOKEN}`,
		},
	};

	const db = await getFirebaseDatabase();
	if (!db) {
		res.status(500).json({ status: 500, error: "Can't connect to database" });
	}

	let movie, likes;
	switch (req.method) {
		case HttpMethods.GET:
			movie = await fetch(url, options)
				.then(r => r.json())
				.catch(err => console.error('error:' + err));

			if (!movie) {
				res.status(404).json({ status: 404, error: 'Not Found' });
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
