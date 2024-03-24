import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../../src/types/HttpMethods';
import { MovieDiscoverType } from '../../../../src/types/themoviedb/MovieTypes';
import { getAllIdMovies } from '../../../../src/queries/mongodb/queries';
import { getRecommendations, ResponsePaginatedMovies } from '../../../../src/queries/themoviedb/queries';

/**
 * @swagger
 * /api/movies/discover/recommended:
 *   get:
 *     description: Returns recommended movies
 *     responses:
 *       200:
 *         description: Success Response
 *       500:
 *         description: Internal Server Error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	let errorMessage: string;
	let moviesIds: number[] = [];
	let results: MovieDiscoverType[] = [];
	let response: ResponsePaginatedMovies;
	let promises: Promise<void>[];
	let settledPromises: PromiseSettledResult<void>[];

	switch (req.method) {
		case HttpMethods.GET:
			try {
				moviesIds = await getAllIdMovies();
			} catch (e) {
				const errorMessage: string = 'Impossible to get all id movies';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ error: errorMessage });
			}

			promises = moviesIds.map(async (id: number) => {
				try {
					response = await getRecommendations(id);
					if (response?.results) {
						results = [...results, ...response.results];
					}
				} catch (e) {
					const errorMessage: string = 'Impossible to get recommendations';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return Promise.reject({ error: errorMessage });
				}
			});

			settledPromises = await Promise.allSettled(promises);

			for (const settledPromise of settledPromises) {
				if (settledPromise.status === 'rejected') {
					return res.status(500).json(settledPromise.reason);
				}
			}

			return res.status(200).json({
				total: results.length,
				movies: results,
			});
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(405).json({ error: errorMessage });
	}
}
