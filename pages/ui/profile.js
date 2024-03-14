import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { useAuth } from '../../src/contexts/auth.context';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
	const { user } = useAuth();
	const router = useRouter();
	const defaultTheme = createTheme();

	useEffect(() => {
		async function fetchUser() {
			if (!user) {
				await router.push('/ui/sign-in');
			}
		}
		fetchUser();
	}, [user, router]);

	return (
		<ThemeProvider theme={defaultTheme}>
			{
				user ? (
					<Container component="main" maxWidth="xs">
						<CssBaseline />
						<p>Email : {user.userData.email}</p>
						<p>Password : {user.userData.password}</p>
					</Container>
				) : <p>User not found</p>
			}
		</ThemeProvider>
	);
}
