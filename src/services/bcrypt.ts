import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const hashString = async (str: string): Promise<string> => {
	return bcrypt.hashSync(str, SALT_ROUNDS);
};

const compareHash = async (str: string, hash: string): Promise<boolean> => {
	return bcrypt.compareSync(str, hash);
};

export { hashString, compareHash };
