import { NextApiRequest, NextApiResponse } from 'next';
import { InsertOneResult, UpdateResult } from 'mongodb';
import { LikeType } from '../../../../src/types/mongodb/LikeType';
import { HttpMethods } from '../../../../src/types/HttpMethods';
import { findOneLikeById, insertOneLike, updateOneLikeById } from '../../../../src/queries/mongodb/queries';

enum LikesActions {
	LIKE = 'like',
	UNLIKE = 'unlike',
}

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
 *           type: number
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
 *           type: number
 *         description: ID movie
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *         description: Action
 *     responses:
 *       201:
 *         description: Success Response
 *       400:
 *         description: Parameter 'action' is required
 *       405:
 *         description: Action not allowed
 *       500:
 *         description: Internal Server Error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const idMovie: number = parseInt(req.query.idMovie as string, 10);
	const action: string = req.query.action as string;

	let like: LikeType | null;
	let errorMessage: string;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				like = await findOneLikeById(idMovie);
				return res.status(200).json(like);
			} catch (e) {
				errorMessage = 'Unable to get likes';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ error: errorMessage });
			}

		case HttpMethods.PATCH:
			if (!action) {
				errorMessage = "Parameter 'action' is required";
				console.error('ERROR: ' + errorMessage);
				return res.status(400).json({ error: errorMessage });
			}
			try {
				like = await findOneLikeById(idMovie);
			} catch (e) {
				errorMessage = 'Unable to search movie';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ error: errorMessage });
			}

			if (like) {
				try {
					let delta: number;
					switch (action) {
						case LikesActions.LIKE:
							delta = 1;
							break;
						case LikesActions.UNLIKE:
							delta = -1;
							break;
						default:
							errorMessage = 'Action not allowed';
							console.error('ERROR: ' + errorMessage);
							return res.status(405).json({ error: errorMessage });
					}
					const resMongo: UpdateResult = await updateOneLikeById(idMovie, {
						$inc: { likeCounter: delta },
					});
					if (resMongo.modifiedCount > 1) {
						console.warn(`WARNING: ${resMongo.modifiedCount} items have been modified`);
					}
					return res.status(201).json({
						action: 'likeCounter incremented',
						idMovie: idMovie,
						previousValue: like.likeCounter,
						newValue: like.likeCounter + delta,
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

		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(405).json({ error: errorMessage });
	}
}
