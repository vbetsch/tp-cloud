import { NextApiRequest, NextApiResponse } from 'next';
import { InsertOneResult, UpdateResult } from 'mongodb';
import { findOneLikeById, insertOneLike, updateOneLikeById } from '../../../../src/queries/FirebaseQueries';
import { LikeType } from '../../../../src/types/firebase/LikeType';
import { HttpMethods } from '../../../../src/types/HttpMethods';

/**
 * @swagger
 * /api/movies/{idMovie}/likes:
 *   get:
 *     description: Returns likes of movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID movie
 *     responses:
 *       200:
 *         description: Success Response
 *       500:
 *         description: Unable to get likes
 *   patch:
 *     description: Create or increment likes of movie
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: ID movie
 *     responses:
 *       201:
 *         description: Success Response
 *       500:
 *         description: Internal Server Error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const idMovie: number = parseInt(req.query.idMovie as string, 10);

	let like: LikeType | null;
	let errorMessage: string;
	switch (req.method) {
		case HttpMethods.PATCH:
			try {
				like = await findOneLikeById(idMovie);
			} catch (e) {
				errorMessage = 'Unable to search movie by id';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ status: 500, error: errorMessage });
			}

			if (like) {
				try {
					const resMongo: UpdateResult = await updateOneLikeById(idMovie, {
						$inc: { likeCounter: 1 },
					});
					const data = {
						action: 'likeCounter incremented',
						idMovie: idMovie,
						matchedCount: resMongo.matchedCount,
						modifiedCount: resMongo.modifiedCount,
					};
					return res.status(201).json({ status: 201, data });
				} catch (e) {
					errorMessage = 'Unable to update like';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return res.status(500).json({ status: 500, error: errorMessage });
				}
			} else {
				try {
					const resMongo: InsertOneResult<Document> = await insertOneLike({
						idTMDB: idMovie,
						likeCounter: 0,
					});
					const data = {
						action: 'likeCounter created',
						idMovie: idMovie,
						insertedId: resMongo.insertedId,
					};
					return res.status(201).json({ status: 201, data });
				} catch (e) {
					errorMessage = 'Unable to insert like';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return res.status(500).json({ status: 500, error: errorMessage });
				}
			}

		case HttpMethods.GET:
			try {
				like = await findOneLikeById(idMovie);
				return res.json({ status: 200, data: { like } });
			} catch (e) {
				errorMessage = 'Unable to get likes';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ status: 500, error: errorMessage });
			}

		default:
			errorMessage = 'Method Not Allowed';
			console.error(`ERROR: ${errorMessage}`);
			return res.status(405).json({ status: 405, error: errorMessage });
	}
}
