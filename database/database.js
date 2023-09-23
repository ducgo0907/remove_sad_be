import mongoose from "mongoose";

const ConnectDB = async () => {
	try {
		const uri = process.env.MONGO_URI;
		mongoose.connect(uri);

		const db = mongoose.connection;

		db.on('connected', () => {
			console.log('Connected to mongoDB');
		});

		db.on('reconnected', () => {
			console.log('Reconnected to mongoDB');
		});
		db.on('error', error => {
			console.log('Mongo connection has an error', error)
			mongoose.disconnect()
		})
		db.on('disconnected', () => {
			console.log('Mongo connection is disconnected')
		})
	} catch (error) {
		console.error('Error connected to MongoDB: ', error);
	}
}

export default ConnectDB;