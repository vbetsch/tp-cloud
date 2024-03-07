import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const idMovie = parseInt(req.query.idMovie as string, 10);

	const client = await clientPromise;
	const db = client.db('cluster');

	let like, likes, resMongo, data;
	switch (req.method) {
		case 'PATCH':
			like = await db.collection('likes').findOne({ idTMDB: idMovie });

			if (like) {
				resMongo = await db.collection('likes').updateOne({ idTMDB: idMovie }, { $inc: { likeCounter: 1 } });
				data = {
					action: 'likeCounter incremented',
					idMovie: idMovie,
					matchedCount: resMongo.matchedCount,
					modifiedCount: resMongo.modifiedCount,
				};
				res.status(201).json({ status: 201, data });
			} else {
				resMongo = await db.collection('likes').insertOne({ idTMDB: idMovie, likeCounter: 0 });
				data = {
					action: 'likeCounter created',
					idMovie: idMovie,
					insertedId: resMongo.insertedId,
				};
				res.status(201).json({ status: 201, data });
			}
			break;

		case 'GET':
			likes = await db.collection('likes').findOne({ idTMDB: idMovie });
			res.json({ status: 200, data: { likes: likes } });
			break;

		default:
			res.status(405).json({ status: 405, error: 'Method Not Allowed' });
			break;
	}
}
