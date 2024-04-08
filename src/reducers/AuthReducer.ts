import { Action } from '../types/ActionType';
import { User } from '../types/User';

export enum AuthActionEnum {
	LOGIN = 'LOGIN',
	LOGOUT = 'LOGOUT',
}

export interface AuthState {
	currentUser: User | undefined;
}

export const initialAuthState: AuthState = {
	currentUser: undefined,
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
		default:
			return state;
	}
};
