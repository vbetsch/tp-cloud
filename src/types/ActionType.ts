import { User } from './User';
import { RememberValues } from '../../pages/auth/sign-in';

export interface Action<T> {
	type: T;
	payload: User | undefined | RememberValues | null;
}
