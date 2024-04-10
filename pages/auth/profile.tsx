import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../src/providers/AuthProvider';
import { AuthUser, getAuthUser, logOut } from '../../src/queries/api/auth';
import { AuthActionEnum } from '../../src/reducers/AuthReducer';
import { RememberValues } from './sign-in';
import { getRememberInLocalStorage, removeRememberInLocalStorage } from '../../src/services/localstorage';
import { useRouter } from 'next/router';

export default function Profile() {
	const { state, dispatch } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const [remember, setRemember] = useState<RememberValues | null>(null);
	const router = useRouter();
	const defaultTheme = createTheme();

	const redirectToSignIn = async () => {
		console.warn('You must be logged in to access this page. You will be redirected...');
		await router.push('/auth/sign-in');
	};

	const clickOnLogOut = async () => {
		setLoading(true);
		try {
			await logOut();
		} catch (e) {
			console.error(e);
			return;
		} finally {
			dispatch({
				type: AuthActionEnum.LOGOUT,
				payload: undefined,
			});
			setLoading(false);
		}

		if (remember) {
			setLoading(true);
			try {
				await removeRememberInLocalStorage();
			} catch (e) {
				console.error(e);
				return;
			} finally {
				setLoading(false);
			}
		}

		switch (remember) {
			case RememberValues.TRUE:
				setLoading(true);
				try {
					await fetchData();
				} catch (e) {
					console.error(e);
					return;
				} finally {
					setLoading(false);
				}
				break;
			case RememberValues.FALSE:
				setLoading(true);
				try {
					await redirectToSignIn();
				} catch (e) {
					console.error(e);
					return;
				} finally {
					setLoading(false);
				}
				break;
		}
	};

	const fetchData = async () => {
		let response: AuthUser;
		setLoading(true);
		try {
			response = await getAuthUser();
		} catch (e) {
			console.error(e);
			return;
		} finally {
			setLoading(false);
		}

		if (typeof response?.user === 'string') {
			console.error('ERROR: Case not implemented');
			return;
		}
		if (!response.user) {
			await redirectToSignIn();
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
		getRememberInLocalStorage()
			.then(data => {
				setRemember(data as RememberValues | null);
				switch (data) {
					case null:
						redirectToSignIn()
							.then()
							.catch(e => console.error(e));
						break;
					case RememberValues.TRUE:
						fetchData()
							.then()
							.catch(e => console.error(e));
						break;
					case RememberValues.FALSE:
						if (state.currentUser) {
							return;
						}
						redirectToSignIn()
							.then()
							.catch(e => console.error(e));
						break;
				}
			})
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
							<p>Remember: {remember}</p>
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
