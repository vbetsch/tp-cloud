import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/config/theme';

interface MyAppProps {
	Component: React.ComponentType<object>;
	pageProps: PropTypes.Validator<object>;
}

export default function MyApp(props: MyAppProps) {
	const { Component, pageProps } = props;

	return (
		<AppCacheProvider {...props}>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<UserProvider>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</UserProvider>
		</AppCacheProvider>
	);
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
import { UserProvider } from '../src/providers/AuthProvider';
