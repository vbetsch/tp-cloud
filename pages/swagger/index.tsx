import React from 'react';
import Head from 'next/head';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const Swagger = () => {
	return (
		<div>
			<Head>
				<title>TP Cloud API</title>
				<meta name="description" content="TP Cloud API Swagger" />
			</Head>
			<SwaggerUI url="/api/doc" />
		</div>
	);
};

export default Swagger;
