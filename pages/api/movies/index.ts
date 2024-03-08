import { NextApiRequest, NextApiResponse } from 'next';

interface MovieTestType {
	_id: number;
	title: string;
}

/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Returns movies for example
 *     responses:
 *       200:
 *         description: Success Response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	const movies: MovieTestType[] = [
		{ _id: 1, title: 'The Batman' },
		{ _id: 2, title: 'The Joker' },
	];
	return res.json({ status: 200, data: movies });
}
