import { UserType } from '../../types/mongodb/UserType';
import { Db, InsertOneResult } from 'mongodb';
import { DatabaseCollections, getMongoDatabase } from '../../config/mongodb';

const findUserByEmail = async (email: string): Promise<UserType | null> => {
	const db: Db = await getMongoDatabase();
	console.info('INFO: Find user by email');
	return await db.collection(DatabaseCollections.USERS).findOne<UserType>({ email: { $eq: email } });
};

const createUser = async (data: UserType): Promise<InsertOneResult> => {
	const db: Db = await getMongoDatabase();
	console.info('INFO: Create user');
	return await db.collection(DatabaseCollections.USERS).insertOne(data);
};

export { findUserByEmail, createUser };
