import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_JWT: string = process.env.SECRET_JWT || 'SECRET_JWT';

const signJwt = async (value: string | object, options: jwt.SignOptions | undefined = undefined): Promise<string> => {
	return jwt.sign(value, SECRET_JWT, options);
};

const verifyJwt = async (token: string): Promise<JwtPayload | string> => {
	return jwt.verify(token, SECRET_JWT);
};

export { signJwt, verifyJwt };
