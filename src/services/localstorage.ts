import { RememberValues } from '../../pages/auth/sign-in';

enum LocalStorageKeys {
	REMEMBER = 'remember',
}

// BASE
const getValueInLocalStorage = (key: LocalStorageKeys): string | null => {
	return localStorage.getItem(key);
};
const setValueInLocalStorage = (key: LocalStorageKeys, value: string): void => {
	localStorage.setItem(key, value);
};
const removeValueInLocalStorage = (key: LocalStorageKeys): void => {
	localStorage.removeItem(key);
};

// REMEMBER
const getRememberInLocalStorage = async (): Promise<string | null> => {
	return getValueInLocalStorage(LocalStorageKeys.REMEMBER);
};
const setRememberInLocalStorage = async (value: RememberValues): Promise<void> => {
	setValueInLocalStorage(LocalStorageKeys.REMEMBER, value);
};
const removeRememberInLocalStorage = async (): Promise<void> => {
	removeValueInLocalStorage(LocalStorageKeys.REMEMBER);
};

export { getRememberInLocalStorage, setRememberInLocalStorage, removeRememberInLocalStorage };
