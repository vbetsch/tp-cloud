import clientPromise from './lib/mongodb';
import { Db, MongoClient } from 'mongodb';

const FIREBASE_DATABASE_NAME: string = 'cluster';

export const getFirebaseDatabase = async (): Promise<Db> => {
	try {
		const client: MongoClient = await clientPromise;
		return client.db(FIREBASE_DATABASE_NAME);
	} catch (e) {
		throw e instanceof Error ? e : new Error("Can't connect to Firebase database : " + e);
	}
};
