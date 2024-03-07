import { ConfigService } from '../../../services/config.service';
import clientPromise from '../../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const idMovie = parseInt(req.query.idMovie as string, 10);
	const url = ConfigService.themoviedb.urls.movie + '/' + idMovie;
	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer ' + process.env.API_TOKEN,
		},
	};

	const client = await clientPromise;
	const db = client.db('cluster');

	let movie, likes;
	switch (req.method) {
		case 'GET':
			movie = await fetch(url, options)
				.then(r => r.json())
				.catch(err => console.error('error:' + err));

			likes = await db.collection('likes').findOne({ idTMDB: idMovie });

			if (likes && likes.likeCounter) {
				movie.likes = likes.likeCounter;
			} else {
				movie.likes = 0;
			}

			if (movie) {
				res.json({ status: 200, data: { movie: movie } });
			} else {
				res.status(404).json({ status: 404, error: 'Not Found' });
			}
			break;

		default:
			res.status(405).json({ status: 405, error: 'Method Not Allowed' });
	}
}
