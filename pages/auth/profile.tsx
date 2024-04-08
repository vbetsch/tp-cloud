import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/providers/AuthProvider';
import { getAuthUser, logOut, signIn } from '../../src/queries/api/auth';
import { AuthActionEnum } from '../../src/reducers/AuthReducer';

export default function Profile() {
	const { state, dispatch } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	const defaultTheme = createTheme();

	const clickOnLogOut = async () => {
		setLoading(true);
		try {
			await logOut();
		} catch (e) {
			console.error(e);
		} finally {
			dispatch({
				type: AuthActionEnum.LOGOUT,
				payload: undefined,
			});
			setLoading(false);
		}
	};

	const fetchUser = async () => {
		setLoading(true);
		let result;
		try {
			result = await getAuthUser();
		} catch (e) {
			console.error(e);
		}
		setLoading(false);
		if (!result || typeof result.user === 'string') {
			console.error('ERROR: Case not implemented');
			return;
		}
		await signIn({
			email: result.user?.email,
			password: result.user?.password,
			remember: true,
		});
	};

	const fetchData = async () => {
		await fetchUser();

		if (!state.currentUser) {
			console.warn('You must be logged in to access this page. You will be redirected...');
			await router.push('/auth/sign-in');
		} else {
			setLoading(true);
			try {
				const response = await signIn({
					email: state.currentUser.data.email,
					password: state.currentUser.data.password,
					remember: true,
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
	};

	useEffect(() => {
		fetchData()
			.then()
			.catch(e => console.error(e));
	}, [state.currentUser]);

	return (
		<ThemeProvider theme={defaultTheme}>
			{loading ? (
				<span>Loading...</span>
			) : (
				<div>
					{state?.currentUser ? (
						<Container component="main" maxWidth="xs">
							<CssBaseline />
							<p>Email : {state?.currentUser?.data.email}</p>
							<p>Password : {state?.currentUser?.data.password}</p>
							<button onClick={clickOnLogOut}>Logout</button>
						</Container>
					) : (
						<p>User not found</p>
					)}
				</div>
			)}
		</ThemeProvider>
	);
}
