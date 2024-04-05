import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'TP Cloud API',
		version: '1.0.0',
	},
	servers: [
		{
			url: '/api',
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ['pages/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
