import { NextApiRequest, NextApiResponse } from 'next';
import { getMoviesDiscover } from '../../queries/TheMovieDbQueries';
import { MovieDiscoverType } from '../../types/themoviedb/MovieTypes';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	try {
		const results: MovieDiscoverType[] | undefined = await getMoviesDiscover();
		res.json({ status: 200, data: results });
	} catch (e) {
		res.status(500).json({ status: 500, error: 'Internal Server Error' });
	}
}
