import { NextApiRequest, NextApiResponse } from 'next';
import { getMoviesDiscover } from '../../queries/TheMovieDbQueries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const results = await getMoviesDiscover();
		res.json({ status: 200, data: results });
	} catch (e) {
		res.status(500).json({ status: 500, error: 'Internal Server Error' });
	}
}
