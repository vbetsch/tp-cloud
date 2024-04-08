import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/providers/AuthProvider';

export default function Profile() {
	const { state } = useAuth();
	const router = useRouter();
	const defaultTheme = createTheme();

	useEffect(() => {
		async function fetchUser() {
			if (!state.currentUser) {
				await router.push('/auth/sign-in');
			}
			console.log('(08/04/2024 02:15)  @reyks  [ profile.tsx:19 ]  state.currentUser  ', state.currentUser);
		}

		fetchUser()
			.then()
			.catch(e => console.error(e));
	}, [state?.currentUser, router]);

	return (
		<ThemeProvider theme={defaultTheme}>
			{state?.currentUser ? (
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<p>Email : {state?.currentUser?.data?.email}</p>
					<p>Password : {state?.currentUser?.data?.password}</p>
				</Container>
			) : (
				<p>User not found</p>
			)}
		</ThemeProvider>
	);
}
