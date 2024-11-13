import mongoose from 'mongoose';
import envConfig from './env/index';

const connectDB = async () => {
  console.log('env config' + JSON.stringify(envConfig))
  try {
    await mongoose.connect(envConfig.database.dbUrl);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;