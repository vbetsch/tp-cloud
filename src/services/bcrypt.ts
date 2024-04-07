import bcrypt from 'bcrypt';

const hashString = (str: string): string => {
	return bcrypt.hashSync(str, 10);
};

export { hashString };
