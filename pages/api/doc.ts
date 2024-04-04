import { withSwagger } from 'next-swagger-doc';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @swagger
 * /api/doc:
 *   get:
 *     description: Returns documentation
 *     responses:
 *       200:
 *         description: Success Response
 */
const swaggerHandler: () => (req: NextApiRequest, res: NextApiResponse) => void = withSwagger({
	openApiVersion: '3.0.0',
	apiFolder: '/pages/api',
	title: 'TP Cloud API',
	version: '1.0.0',
});
export default swaggerHandler();
