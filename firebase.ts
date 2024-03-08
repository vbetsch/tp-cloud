import clientPromise from './lib/mongodb';

const FIREBASE_DATABASE_NAME = 'cluster';

export enum FirebaseCollections {
	LIKES = 'likes',
}

export const getFirebaseDatabase = async () => {
	try {
		const client = await clientPromise;
		if (client) {
			return client.db(FIREBASE_DATABASE_NAME);
		}
	} catch (e) {
		console.error(e);
	}
};
