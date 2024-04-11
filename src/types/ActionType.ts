import { User } from './User';
import { RememberValues } from '../../pages/auth/sign-in';

export interface Action<T> {
	type: T;
	payload: User | RememberValues | boolean | undefined | null;
}
