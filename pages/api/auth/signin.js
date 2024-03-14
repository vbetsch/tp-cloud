import { serialize } from 'cookie';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export default async function handler(req, res) {
	const { email, password, remember } = req.body;

	const userData = {
		email,
		password: bcrypt.hashSync(password, 10)
	};
	const token = jwt.sign(userData, 'JWT_SECRET');

	if (remember) {
		const cookie = serialize('session', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // One week
			path: '/',
		});
		res.setHeader('Set-Cookie', cookie);
	}

	res.status(200).json({
		userData,
		token,
		message: 'Successfully set cookie!',
	});
}
