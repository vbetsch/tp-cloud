import { getFirebaseDatabase } from '../firebase';
import { Db, Document, InsertOneResult, OptionalId, UpdateFilter, UpdateResult } from 'mongodb';
import { LikeType } from '../types/firebase/LikeType';

enum FirebaseCollections {
	LIKES = 'likes',
}

export const findOneLikeById = async (idTMDB: number): Promise<LikeType | null | undefined> => {
	try {
		const db: Db | undefined = await getFirebaseDatabase();
		if (!db) {
			console.error('Firebase database not found');
			return;
		}
		return await db.collection(FirebaseCollections.LIKES).findOne<LikeType>({ idTMDB: idTMDB });
	} catch (e) {
		if (e instanceof Error) {
			console.error('Unable to search for a like : ' + e.message);
		} else {
			console.error(e);
		}
	}
};

export const updateOneLikeById = async (
	idTMDB: number,
	update: Partial<Document> | UpdateFilter<Document>,
): Promise<undefined | UpdateResult> => {
	try {
		const db: Db | undefined = await getFirebaseDatabase();
		if (!db) {
			console.error('Firebase database not found');
			return;
		}
		return await db.collection(FirebaseCollections.LIKES).updateOne({ idTMDB: idTMDB }, update);
	} catch (e) {
		if (e instanceof Error) {
			console.error('Unable to update a like : ' + e.message);
		} else {
			console.error(e);
		}
	}
};

export const insertOneLike = async (doc: OptionalId<Document>): Promise<undefined | InsertOneResult> => {
	try {
		const db: Db | undefined = await getFirebaseDatabase();
		if (!db) {
			console.error('Firebase database not found');
			return;
		}
		return await db.collection(FirebaseCollections.LIKES).insertOne(doc);
	} catch (e) {
		if (e instanceof Error) {
			console.error('Unable to add a like : ' + e.message);
		} else {
			console.error(e);
		}
	}
};
