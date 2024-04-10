import React, { useState } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from '../../src/templates/AuthPage';
import { logOut } from '../../src/queries/api/auth';
import { AuthActionEnum } from '../../src/reducers/AuthReducer';
import { removeRememberInLocalStorage } from '../../src/services/localstorage';
import { useAuth } from '../../src/providers/AuthProvider';
import { useRouter } from 'next/router';

export default function Profile() {
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
		<AuthPage>
			<Container component="main" maxWidth="xs">
				{loading ? (
					<p>Loading...</p>
				) : (
					<div>
						<CssBaseline />
						<p>Email : {state?.currentUser?.data.email}</p>
						<p>Password : {state?.currentUser?.data.password}</p>
						<p>Remember: {state?.remember}</p>
						<button onClick={clickOnLogOut}>Logout</button>
					</div>
				)}
			</Container>
		</AuthPage>
	);
}
