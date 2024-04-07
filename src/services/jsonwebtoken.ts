import jwt from 'jsonwebtoken';

const signJwt = async (
	key: string,
	value: string | object,
	options: jwt.SignOptions | undefined = undefined,
): Promise<string> => {
	return jwt.sign(value, key, options);
};

export { signJwt };
