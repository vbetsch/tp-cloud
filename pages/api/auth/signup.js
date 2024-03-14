import bcrypt from 'bcrypt';
import clientPromise from '/lib/mongodb';


export default async function handler(req, res) {
	const { email, password } = req.body;
	const client = await clientPromise;
	const db = client.db('cluster');

	const userData = {
		email,
		password: bcrypt.hashSync(password, 10),
	};

	try {
		const newUser = await db.collection('users').insertOne(userData);
		res.status(200).json({
			newUser,
			message: 'Successfully create user!',
		});
	} catch (err) {
	    console.error(err)
		res.status(400).json({
			message: 'Cannot create user',
		});
	}

}
