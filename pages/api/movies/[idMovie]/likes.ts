import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../../types/HttpMethods';
import { getFirebaseDatabase } from '../../../../firebase';
import { findOneLikeById, insertOneLike, updateOneLikeById } from '../../../../queries/FirebaseQueries';
import { LikeType } from '../../../../types/firebase/LikeType';
import { Db, InsertOneResult, UpdateResult } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const idMovie: number = parseInt(req.query.idMovie as string, 10);

	const db: Db | undefined = await getFirebaseDatabase();
	if (!db) {
		res.status(500).json({ status: 500, error: "Can't connect to database" });
	}

	let like: LikeType | undefined | null;
	switch (req.method) {
		case HttpMethods.PATCH:
			try {
				like = await findOneLikeById(idMovie);
			} catch (e) {
				console.error(e);
				return;
			}

			if (like) {
				try {
					const resMongo: UpdateResult | undefined = await updateOneLikeById(idMovie, {
						$inc: { likeCounter: 1 },
					});
					const data = {
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
					const resMongo: InsertOneResult<Document> | undefined = await insertOneLike({
						idTMDB: idMovie,
						likeCounter: 0,
					});
					const data = {
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
