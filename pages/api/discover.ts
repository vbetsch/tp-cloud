import { NextApiRequest, NextApiResponse } from 'next';
import { getMoviesDiscover } from '../../queries/TheMovieDbQueries';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	try {
		return res.json({ status: 200, data: await getMoviesDiscover() });
	} catch (e) {
		const errorMessage: string = 'Unable to search movies to discover';
		console.error(`ERROR: ${errorMessage} -> ${e instanceof Error ? e.message : e}`);
		return res.status(500).json({ status: 500, error: errorMessage });
	}
}
