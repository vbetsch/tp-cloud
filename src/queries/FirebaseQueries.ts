import { Db, Document, InsertOneResult, OptionalId, UpdateFilter, UpdateResult } from 'mongodb';
import { LikeType } from '../types/firebase/LikeType';
import { getFirebaseDatabase } from '../../firebase';

enum FirebaseCollections {
	LIKES = 'likes',
}

export const getAllIdMovies = async (): Promise<number[]> => {
	const db: Db = await getFirebaseDatabase();
	console.info('INFO: Get all id movies');
	return db.collection(FirebaseCollections.LIKES).distinct('idTMDB');
};

export const findOneLikeById = async (idTMDB: number): Promise<LikeType | null> => {
	const db: Db = await getFirebaseDatabase();
	const result: LikeType | null = await db
		.collection(FirebaseCollections.LIKES)
		.findOne<LikeType>({ idTMDB: idTMDB });
	console.info('INFO: Find one like');
	return result;
};

export const updateOneLikeById = async (
	idTMDB: number,
	update: Partial<Document> | UpdateFilter<Document>,
): Promise<UpdateResult> => {
	const db: Db = await getFirebaseDatabase();
	const result: UpdateResult = await db.collection(FirebaseCollections.LIKES).updateOne({ idTMDB: idTMDB }, update);
	console.info('INFO: Update one like');
	return result;
};

export const insertOneLike = async (doc: OptionalId<Document>): Promise<InsertOneResult> => {
	const db: Db = await getFirebaseDatabase();
	const result: InsertOneResult = await db.collection(FirebaseCollections.LIKES).insertOne(doc);
	console.info('INFO: Insert one like');
	return result;
};
