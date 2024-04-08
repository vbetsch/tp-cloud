import { UserType } from './mongodb/UserType';

export interface User {
	data: UserType;
	token: string;
}
