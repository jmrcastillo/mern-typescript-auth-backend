
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = () => {
  // MongoDB Setup
  //const MONGO_URL = 'mongodb+srv://jm:jm2024@cluster0.nlu97nj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

  const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
  const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.nlu97nj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

  mongoose.Promise = Promise;
  mongoose.connect(MONGO_URL);
  mongoose.connection.on('error Connecting Jibreel', (error: Error) => console.log(error))
};

export default connectDb;

