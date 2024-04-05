import React from 'react';
import Head from 'next/head';

const DEFAULT_TITLE: string = 'TP Cloud';

export interface TitleProperties {
	title?: string;
}

export default function Title(props: TitleProperties): React.JSX.Element {
	return (
		<Head>
			<title>
				{DEFAULT_TITLE}
				{props.title && ' - ' + props.title}
			</title>
		</Head>
	);
}
