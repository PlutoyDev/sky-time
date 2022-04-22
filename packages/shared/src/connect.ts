import mongoose from 'mongoose';

export async function connect() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI must be defined');
  }

  await mongoose.connect(mongoUri);
  console.log(`Connected to MongoDB`);
}
