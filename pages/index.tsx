import React from 'react';

export default function Home(): JSX.Element {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
			<h1>Links</h1>
			<a href="http://localhost:3000/api/movies">API</a>
			<a href="http://localhost:3000/docs">Swagger</a>
			<a href="http://localhost:3000/ui">UI</a>
		</div>
	);
}
