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
				return res.status(500).json({ error: errorMessage });
			}

			if (like) {
				try {
					const resMongo: UpdateResult = await updateOneLikeById(idMovie, {
						$inc: { likeCounter: 1 },
					});
					if (resMongo.modifiedCount > 1) {
						console.warn(`WARNING: ${resMongo.modifiedCount} items have been modified`);
					}
					return res.status(201).json({
						action: 'likeCounter incremented',
						idMovie: idMovie,
						previousValue: like.likeCounter,
						newValue: like.likeCounter + 1,
					});
				} catch (e) {
					errorMessage = 'Unable to update like';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return res.status(500).json({ error: errorMessage });
				}
			} else {
				try {
					const resMongo: InsertOneResult<Document> = await insertOneLike({
						idTMDB: idMovie,
						likeCounter: 0,
					});
					return res.status(201).json({
						action: 'likeCounter created',
						insertedId: resMongo.insertedId,
						idMovie: idMovie,
					});
				} catch (e) {
					errorMessage = 'Unable to insert like';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return res.status(500).json({ error: errorMessage });
				}
			}

		case HttpMethods.GET:
			try {
				like = await findOneLikeById(idMovie);
				return res.json({ data: { like } });
			} catch (e) {
				errorMessage = 'Unable to get likes';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ error: errorMessage });
			}

		default:
			errorMessage = 'Method Not Allowed';
			console.error(`ERROR: ${errorMessage}`);
			return res.status(405).json({ error: errorMessage });
	}
}
