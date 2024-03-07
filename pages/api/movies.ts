import {NextApiRequest, NextApiResponse} from "next";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Returns movies
 *     responses:
 *       200:
 *         description: Hello Movies
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const movies = [
        {_id: 1, title: "The Batman"},
        {_id: 2, title: "The Joker"},
    ];
    res.json({status: 200, data: movies});
}
