import { NextApiRequest, NextApiResponse } from 'next';

interface MovieTestType {
	_id: number;
	title: string;
}

/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Returns movies
 *     responses:
 *       200:
 *         description: Hello Movies
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const movies: MovieTestType[] = [
		{ _id: 1, title: 'The Batman' },
		{ _id: 2, title: 'The Joker' },
	];
	res.json({ status: 200, data: movies });
}
