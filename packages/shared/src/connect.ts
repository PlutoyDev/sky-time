import mongoose from 'mongoose';

export default async function connectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI must be defined');
  }

  await mongoose.connect(mongoUri);
  console.log(`Connected to MongoDB`);
}
