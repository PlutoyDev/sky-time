import mongoose from 'mongoose';

type globalDbc = typeof global & {
  dbConnected: boolean;
};

export default async function connectDb() {
  if (!(global as globalDbc).dbConnected) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI must be defined');
    }

    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB`);
    (global as globalDbc).dbConnected = true;
  }
}
