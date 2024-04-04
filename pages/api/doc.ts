import { NextApiRequest, NextApiResponse } from 'next';
import swaggerSpec from '../../src/swagger';

/**
 * @swagger
 * /api/doc:
 *   get:
 *     description: Returns documentation
 *     responses:
 *       200:
 *         description: Success Response
 */
const swaggerHandler = (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Content-Type', 'application/json');
	res.status(200).json(swaggerSpec);
};

export default swaggerHandler;
