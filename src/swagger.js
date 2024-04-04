const swaggerJSDoc = require('swagger-jsdoc');

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
	apis: ['pages/api/**/*.ts'], // Chemin vers vos fichiers de route
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
