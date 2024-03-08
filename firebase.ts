import clientPromise from './lib/mongodb';
import { Db, MongoClient } from 'mongodb';

const FIREBASE_DATABASE_NAME: string = 'cluster';

export const getFirebaseDatabase = async (): Promise<Db | undefined> => {
	try {
		const client: MongoClient = await clientPromise;
		if (client) {
			return client.db(FIREBASE_DATABASE_NAME);
		}
	} catch (e) {
		console.error(e);
	}
};
