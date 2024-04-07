import { DatabaseCollections, getMongoDatabase } from '../../config/mongodb';
import { Db, InsertOneResult, UpdateFilter, UpdateResult } from 'mongodb';
import { LikeType } from '../../types/mongodb/LikeType';

const getAllIdMovies = async (): Promise<number[]> => {
	const db: Db = await getMongoDatabase();
	console.info('INFO: Get all id movies');
	return await db.collection(DatabaseCollections.LIKES).distinct('idTMDB');
};

const findOneLikeById = async (idTMDB: number): Promise<LikeType | null> => {
	const db: Db = await getMongoDatabase();
	const result: LikeType | null = await db
		.collection(DatabaseCollections.LIKES)
		.findOne<LikeType>({ idTMDB: idTMDB });
	console.info('INFO: Find one like');
	return result;
};

const updateOneLikeById = async (
	idTMDB: number,
	update: Partial<Document> | UpdateFilter<Document>,
): Promise<UpdateResult> => {
	const db: Db = await getMongoDatabase();
	const result: UpdateResult = await db.collection(DatabaseCollections.LIKES).updateOne({ idTMDB: idTMDB }, update);
	console.info('INFO: Update one like');
	return result;
};

const insertOneLike = async (data: LikeType): Promise<InsertOneResult> => {
	const db: Db = await getMongoDatabase();
	console.info('INFO: Insert one like');
	return await db.collection(DatabaseCollections.LIKES).insertOne(data);
};

export { getAllIdMovies, findOneLikeById, updateOneLikeById, insertOneLike };
