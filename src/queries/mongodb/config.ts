import clientPromise from '../../../lib/mongodb';
import { Db, MongoClient } from 'mongodb';

const getMongoDatabase = async (): Promise<Db> => {
	try {
		const client: MongoClient = await clientPromise;
		return client.db(process.env.MONGO_DATABASE);
	} catch (e) {
		throw e instanceof Error ? e : new Error("Can't connect to MongoDB database : " + e);
	}
};

enum DatabaseCollections {
	LIKES = 'likes',
}

export { getMongoDatabase, DatabaseCollections };
