import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../../src/types/http/HttpMethods';
import { MovieDiscoverType } from '../../../../src/types/themoviedb/MovieTypes';
import { HttpCodeStatus } from '../../../../src/types/http/HttpCodeStatus';
import { ResponsePaginatedMovies } from '../../../../src/types/themoviedb/queries/ResponsePaginatedMovies';
import { getAllIdMovies } from '../../../../src/queries/mongodb';
import { getRecommendations } from '../../../../src/queries/themoviedb';

/**
 * @swagger
 * /api/movies/discover/recommended:
 *   get:
 *     description: Returns recommended movies
 *     responses:
 *       200:
 *         description: Success Response
 *       404:
 *         description: You don't have any favorite movies yet
 *       500:
 *         description: Internal Server Error
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	let errorMessage: string;
	let warnMessage: string;
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
				return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json({ error: errorMessage });
			}

			promises = moviesIds.map(async (id: number) => {
				try {
					response = await getRecommendations(id);
				} catch (e) {
					const errorMessage: string = 'Impossible to get recommendations';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return Promise.reject({ error: errorMessage });
				}
				if (response?.results) {
					results = [...results, ...response.results];
				}
			});

			settledPromises = await Promise.allSettled(promises);

			for (const settledPromise of settledPromises) {
				if (settledPromise.status === 'rejected') {
					return res.status(HttpCodeStatus.INTERNAL_SERVER_ERROR).json(settledPromise.reason);
				}
			}

			if (!results.length) {
				warnMessage = "You don't have any favorite movies yet";
				console.warn('WARN: ' + warnMessage);
				return res.status(HttpCodeStatus.NOT_FOUND).json({ message: warnMessage });
			}

			return res.status(HttpCodeStatus.OK).json({
				total: results.length,
				movies: results,
			});
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(HttpCodeStatus.METHOD_NOT_ALLOWED).json({ error: errorMessage });
	}
}
