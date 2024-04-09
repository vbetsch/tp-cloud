import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/providers/AuthProvider';
import { AuthUser, getAuthUser, logOut } from '../../src/queries/api/auth';
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

	const fetchData = async () => {
		setLoading(true);
		const response: AuthUser = await getAuthUser();
		setLoading(false);
		if (typeof response?.user === 'string') {
			console.error('ERROR: Case not implemented');
			return;
		}
		if (!response.user) {
			console.warn('You must be logged in to access this page. You will be redirected...');
			await router.push('/auth/sign-in');
			return;
		}
		dispatch({
			type: AuthActionEnum.LOGIN,
			payload: {
				data: {
					email: response.user.email,
					password: response.user.password,
				},
				token: response.token,
			},
		});
	};

	useEffect(() => {
		fetchData()
			.then()
			.catch(e => console.error(e));
	}, []);

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
