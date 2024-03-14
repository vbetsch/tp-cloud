import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../../src/types/HttpMethods';
import { getAllIdMovies } from '../../../../src/queries/FirebaseQueries';
import { getRecommendations, ResponseMovies } from '../../../../src/queries/TheMovieDbQueries';
import { MovieDiscoverType } from '../../../../src/types/themoviedb/MovieTypes';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	let errorMessage: string;
	let moviesIds: number[] = [];
	let results: MovieDiscoverType[] = [];
	let response: ResponseMovies;
	let promises: Promise<void>[];

	switch (req.method) {
		case HttpMethods.GET:
			try {
				moviesIds = await getAllIdMovies();
			} catch (e) {
				const errorMessage: string = 'Internal Server Error';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ status: 500, error: errorMessage });
			}

			promises = moviesIds.map(async (id: number) => {
				try {
					response = await getRecommendations(id);
				} catch (e) {
					const errorMessage: string = 'Internal Server Error';
					console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
					return res.status(500).json({ status: 500, error: errorMessage });
				}
				if (response?.results) {
					results = [...results, ...response.results];
				}
			});

			await Promise.all(promises);

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
