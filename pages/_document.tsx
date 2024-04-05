import * as React from 'react';
import { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { documentGetInitialProps, DocumentHeadTags, DocumentHeadTagsProps } from '@mui/material-nextjs/v14-pagesRouter';
import theme from '../src/config/theme';

export default function Document(props: React.JSX.IntrinsicAttributes & DocumentHeadTagsProps) {
	return (
		<Html lang="en">
			<Head>
				<meta name="theme-color" content={theme.palette.primary.main} />
				<meta name="emotion-insertion-point" content="" />
				<link
					id="favicon"
					rel="shortcut icon"
					href="https://files.readme.io/6dc6435-small-favicon.png"
					type="image/png"
				/>
				<DocumentHeadTags {...props} />
			</Head>
			<body style={{ margin: 0 }}>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

Document.getInitialProps = async (ctx: DocumentContext) => {
	return await documentGetInitialProps(ctx);
};
