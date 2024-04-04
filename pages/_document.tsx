import * as React from 'react';
import { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { documentGetInitialProps, DocumentHeadTags, DocumentHeadTagsProps } from '@mui/material-nextjs/v14-pagesRouter';
import theme from '../src/theme/theme';

export default function MyDocument(props: React.JSX.IntrinsicAttributes & DocumentHeadTagsProps) {
	return (
		<Html lang="en">
			<Head>
				{/* PWA primary color */}
				<meta name="theme-color" content={theme.palette.primary.main} />
				<meta name="emotion-insertion-point" content="" />
				<DocumentHeadTags {...props} />
			</Head>
			<body style={{ margin: 0 }}>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
	return await documentGetInitialProps(ctx);
};
