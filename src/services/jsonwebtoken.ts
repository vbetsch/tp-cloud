import jwt from 'jsonwebtoken';

const signJwt = (key: string, value: string | object, options: jwt.SignOptions | undefined = undefined): string => {
	return jwt.sign(value, key, options);
};

export { signJwt };
