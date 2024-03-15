import clientPromise from '../../../lib/mongodb';
import { Db, MongoClient } from 'mongodb';

const getFirebaseDatabase = async (): Promise<Db> => {
	try {
		const client: MongoClient = await clientPromise;
		return client.db(process.env.FIREBASE_DATABASE_NAME);
	} catch (e) {
		throw e instanceof Error ? e : new Error("Can't connect to Firebase database : " + e);
	}
};

enum FirebaseCollections {
	LIKES = 'likes',
}

export { getFirebaseDatabase, FirebaseCollections };
