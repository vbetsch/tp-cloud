import { NextApiRequest, NextApiResponse } from 'next';
import { getMoviesDiscover } from '../../queries/TheMovieDbQueries';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	try {
		res.json({ status: 200, data: await getMoviesDiscover() });
	} catch (e) {
		const errorMessage = 'ERROR: Unable to search for films to discover';
		console.error(`${errorMessage} : ${e instanceof Error ? e.message : e}`);
		res.status(500).json({ status: 500, error: errorMessage });
	}
}
