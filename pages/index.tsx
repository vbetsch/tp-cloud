import React from 'react';
import Link from 'next/link';

export default function Home(): JSX.Element {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
			<h1>Links</h1>
			<Link href="/api/movies">API</Link>
			<Link href="/docs">Swagger</Link>
			<Link href="/ui">UI</Link>
		</div>
	);
}
