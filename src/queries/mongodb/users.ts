import { UserType } from '../../types/mongodb/UserType';
import { Db, InsertOneResult } from 'mongodb';
import { DatabaseCollections, getMongoDatabase } from '../../config/mongodb';

const createUser = async (data: UserType): Promise<InsertOneResult> => {
	const db: Db = await getMongoDatabase();
	console.info('INFO: Create user');
	return await db.collection(DatabaseCollections.USERS).insertOne(data);
};

export { createUser };
