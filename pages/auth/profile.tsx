import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/providers/AuthProvider';
import { getAuthUser } from '../../src/queries/api/auth';
import { JwtPayload } from 'jsonwebtoken';
import { AuthActionEnum } from '../../src/reducers/AuthReducer';

export default function Profile() {
	const [user, setUser] = useState<JwtPayload | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const { state, dispatch } = useAuth();
	const router = useRouter();
	const defaultTheme = createTheme();

	const fetchUser = async () => {
		setLoading(true);
		let result;
		try {
			result = await getAuthUser();
		} catch (e) {
			console.error(e);
		}
		if (!result) {
			return;
		}
		if (typeof result.user === 'string') {
			console.error('ERROR: Case not implemented');
			setLoading(false);
		} else {
			setUser(result.user);
			setLoading(false);
			return result.user;
		}
	};

	const fetchData = async () => {
		if (!state.currentUser) {
			const _user = await fetchUser();

			if (!_user) {
				console.warn('You must be logged in to access this page. You will be redirected...');
				await router.push('/auth/sign-in');
			} else {
				setLoading(true);
				try {
					const response = await fetch('/api/auth/signin', {
						method: 'POST',
						body: JSON.stringify({
							email: _user.email,
							password: _user.password,
							remember: true,
						}),
						headers: {
							'Content-Type': 'application/json',
						},
					});
					if (response.status === 200) {
						const data = await response.json();
						dispatch({
							type: AuthActionEnum.LOGIN,
							payload: {
								data: data.userData,
								token: data.token,
							},
						});
						await router.push('/auth/profile');
					} else {
						console.error('Failed to sign in : ', response);
					}
				} catch (error) {
					console.error('Error signing in:', error);
				} finally {
					setLoading(false);
				}
			}
		}
	};

	useEffect(() => {
		fetchData()
			.then()
			.catch(e => console.error(e));
	}, [state?.currentUser]);

	return (
		<ThemeProvider theme={defaultTheme}>
			{loading ? (
				<span>Loading...</span>
			) : (
				<div>
					{state?.currentUser || user ? (
						<Container component="main" maxWidth="xs">
							<CssBaseline />
							<p>Email : {state?.currentUser?.data?.email || user?.email}</p>
							<p>Password : {state?.currentUser?.data?.password || user?.password}</p>
						</Container>
					) : (
						<p>User not found</p>
					)}
				</div>
			)}
		</ThemeProvider>
	);
}
