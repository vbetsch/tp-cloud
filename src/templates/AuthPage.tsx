import React, { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { RememberValues } from '../../pages/auth/sign-in';
import { useRouter } from 'next/router';
import { AuthUser, getAuthUser } from '../queries/api/auth';
import { AuthActionEnum } from '../reducers/AuthReducer';
import { getRememberInLocalStorage } from '../services/localstorage';

export interface AuthPageProperties {
	children: ReactElement;
}

export default function AuthPage(props: AuthPageProperties) {
	const { state, dispatch } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const redirectToSignIn = async () => {
		console.warn('You must be logged in to access this page. You will be redirected...');
		await router.push('/auth/sign-in');
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
				dispatch({
					type: AuthActionEnum.SET_REMEMBER,
					payload: data as RememberValues | null,
				});
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

	return loading || !state?.currentUser ? <p>Loading...</p> : props.children;
}
