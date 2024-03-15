import { NextApiRequest, NextApiResponse } from 'next';
import { HttpMethods } from '../../../src/types/HttpMethods';
import { getSearchMovies, ResponsePaginatedMovies } from '../../../src/queries/TheMovieDbQueries';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const query: string = (req.query.query as string) || '';
	const page: number = parseInt(req.query.page as string, 10) || 1;

	let errorMessage: string;
	let response: ResponsePaginatedMovies;
	switch (req.method) {
		case HttpMethods.GET:
			try {
				response = await getSearchMovies(query, page);
			} catch (e) {
				const errorMessage: string = 'Internal Server Error';
				console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
				return res.status(500).json({ status: 500, error: errorMessage });
			}

			return res.status(200).json(response);
		default:
			errorMessage = 'Method Not Allowed';
			console.error('ERROR: ' + errorMessage);
			return res.status(405).json({ error: errorMessage });
	}
}
