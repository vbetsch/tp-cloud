import React, { ReactElement, useContext } from 'react';
import { createContext, Dispatch, useReducer } from 'react';
import { AuthActionEnum, AuthReducer, AuthState, initialAuthState } from '../reducers/AuthReducer';
import { Action } from '../types/ActionType';

const defaultValueType = {
	state: initialAuthState,
	dispatch: () => null,
};

export const UserContext = createContext<{
	state: AuthState;
	dispatch: Dispatch<Action<AuthActionEnum>>;
}>(defaultValueType);

export const UserProvider = ({ children }: { children: ReactElement }) => {
	const [state, dispatch] = useReducer(AuthReducer, initialAuthState);

	return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
};

export function useAuth() {
	return useContext(UserContext);
}
