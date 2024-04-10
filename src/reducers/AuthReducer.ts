import { Action } from '../types/ActionType';
import { User } from '../types/User';
import { RememberValues } from '../../pages/auth/sign-in';

export enum AuthActionEnum {
	LOGIN = 'LOGIN',
	LOGOUT = 'LOGOUT',
	SET_REMEMBER = 'SET_REMEMBER',
}

export interface AuthState {
	currentUser: User | undefined;
	remember: RememberValues | null;
}

export const initialAuthState: AuthState = {
	currentUser: undefined,
	remember: null,
};

export const AuthReducer = (state: AuthState, action: Action<AuthActionEnum>): AuthState => {
	switch (action.type) {
		case AuthActionEnum.LOGIN:
			return {
				...state,
				currentUser: action.payload as User | undefined,
			};
		case AuthActionEnum.LOGOUT:
			return {
				...state,
				currentUser: undefined,
			};
		case AuthActionEnum.SET_REMEMBER:
			return {
				...state,
				remember: action.payload as RememberValues | null,
			};
		default:
			return state;
	}
};
