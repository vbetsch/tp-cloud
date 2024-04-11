import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from '../../src/templates/AuthPage';
import NavbarPage from '../../src/templates/NavbarPage';
import { logOut } from '../../src/queries/api/auth';
import { AuthActionEnum } from '../../src/reducers/AuthReducer';
import { removeRememberInLocalStorage } from '../../src/services/localstorage';
import { useAuth } from '../../src/providers/AuthProvider';
import { useRouter } from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import { RememberValues } from './sign-in';

export default function Profile() {
	const defaultTheme = createTheme();
	const router = useRouter();
	const { state, dispatch } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);

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

		if (state?.remember) {
			setLoading(true);
			try {
				dispatch({
					type: AuthActionEnum.SET_REMEMBER,
					payload: null,
				});
				await removeRememberInLocalStorage();
			} catch (e) {
				console.error(e);
				return;
			} finally {
				setLoading(false);
			}
		}

		setLoading(true);
		try {
			console.warn('You must be logged in to access this page. You will be redirected...');
			await router.push('/auth/sign-in');
		} catch (e) {
			console.error(e);
			return;
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<AuthPage>
				<NavbarPage title={'Profile'}>
					<Container component="main" maxWidth="xs">
						{loading ? (
							<p>Loading...</p>
						) : (
							<div>
								<CssBaseline />
								<p>
									<b>Email :</b> {state?.currentUser?.data.email}
								</p>
								<p>
									<b>Cookies: </b>
									{state?.remember === RememberValues.TRUE ? 'acceptés' : 'refusés'}
								</p>
								<LoadingButton loading={loading} onClick={clickOnLogOut} variant="contained">
									Logout
								</LoadingButton>
							</div>
						)}
					</Container>
				</NavbarPage>
			</AuthPage>
		</ThemeProvider>
	);
}
