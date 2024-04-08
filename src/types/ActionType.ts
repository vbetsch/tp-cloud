import { User } from './User';

export interface Action<T> {
	type: T;
	payload: User | undefined;
}
