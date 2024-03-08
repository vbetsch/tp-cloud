import { getFirebaseDatabase } from '../firebase';
import { UpdateFilter } from 'mongodb';

enum FirebaseCollections {
	LIKES = 'likes',
}

export const findOneLikeById = async (idTMDB: number) => {
	try {
		const db = await getFirebaseDatabase();
		if (!db) {
			console.error("Can't connect to Firebase database");
			return;
		}
		return await db.collection(FirebaseCollections.LIKES).findOne({ idTMDB: idTMDB });
	} catch (e) {
		console.error(e);
	}
};

export const updateOneLikeById = async (idTMDB: number, update: Partial<Document> | UpdateFilter<Document>) => {
	try {
		const db = await getFirebaseDatabase();
		if (!db) {
			console.error("Can't connect to Firebase database");
			return;
		}
		return await db.collection(FirebaseCollections.LIKES).updateOne({ idTMDB: idTMDB }, update);
	} catch (e) {
		console.error(e);
	}
};

export const insertOneLike = async (doc: any) => {
	try {
		const db = await getFirebaseDatabase();
		if (!db) {
			console.error("Can't connect to Firebase database");
			return;
		}
		return await db.collection(FirebaseCollections.LIKES).insertOne(doc);
	} catch (e) {
		console.error(e);
	}
};
