import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../../types/HttpMethods';
import { FirebaseCollections, getFirebaseDatabase } from '../../../../firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const idMovie = parseInt(req.query.idMovie as string, 10);

	const db = await getFirebaseDatabase();
	if (!db) {
		res.status(500).json({ status: 500, error: "Can't connect to database" });
	}

	let like, likes, resMongo, data;
	switch (req.method) {
		case HttpMethods.PATCH:
			like = await db?.collection(FirebaseCollections.LIKES).findOne({ idTMDB: idMovie });

			if (like) {
				resMongo = await db
					?.collection(FirebaseCollections.LIKES)
					.updateOne({ idTMDB: idMovie }, { $inc: { likeCounter: 1 } });
				data = {
					action: 'likeCounter incremented',
					idMovie: idMovie,
					matchedCount: resMongo?.matchedCount,
					modifiedCount: resMongo?.modifiedCount,
				};
				res.status(201).json({ status: 201, data });
			} else {
				resMongo = await db
					?.collection(FirebaseCollections.LIKES)
					.insertOne({ idTMDB: idMovie, likeCounter: 0 });
				data = {
					action: 'likeCounter created',
					idMovie: idMovie,
					insertedId: resMongo?.insertedId,
				};
				res.status(201).json({ status: 201, data });
			}
			break;

		case HttpMethods.GET:
			likes = await db?.collection(FirebaseCollections.LIKES).findOne({ idTMDB: idMovie });
			res.json({ status: 200, data: { likes } });
			break;

		default:
			res.status(405).json({ status: 405, error: 'Method Not Allowed' });
			break;
	}
}
