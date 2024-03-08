import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../../types/HttpMethods';
import { getFirebaseDatabase } from '../../../../firebase';
import { findOneLikeById, insertOneLike, updateOneLikeById } from '../../../../queries/FirebaseQueries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const idMovie = parseInt(req.query.idMovie as string, 10);

	const db = await getFirebaseDatabase();
	if (!db) {
		res.status(500).json({ status: 500, error: "Can't connect to database" });
	}

	let like, resMongo, data;
	switch (req.method) {
		case HttpMethods.PATCH:
			try {
				like = await findOneLikeById(idMovie);
			} catch (e) {
				console.error(e);
			}

			if (like) {
				try {
					resMongo = await updateOneLikeById(idMovie, { $inc: { likeCounter: 1 } });
					data = {
						action: 'likeCounter incremented',
						idMovie: idMovie,
						matchedCount: resMongo?.matchedCount,
						modifiedCount: resMongo?.modifiedCount,
					};
					res.status(201).json({ status: 201, data });
				} catch (e) {
					console.error(e);
				}
			} else {
				try {
					resMongo = await insertOneLike({ idTMDB: idMovie, likeCounter: 0 });
					data = {
						action: 'likeCounter created',
						idMovie: idMovie,
						insertedId: resMongo?.insertedId,
					};
					res.status(201).json({ status: 201, data });
				} catch (e) {
					console.error(e);
				}
			}
			break;

		case HttpMethods.GET:
			try {
				like = await findOneLikeById(idMovie);
				res.json({ status: 200, data: { like } });
			} catch (e) {
				console.error(e);
			}
			break;

		default:
			res.status(405).json({ status: 405, error: 'Method Not Allowed' });
			break;
	}
}
