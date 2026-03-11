import mongoose from 'mongoose'

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/virtual-wardrobe'
  await mongoose.connect(uri)
<<<<<<< HEAD
  // Log a sanitized URI to avoid leaking credentials in output
  const sanitized = uri.replace(/:\/\/[^@]+@/, '://<credentials>@')
  console.log('MongoDB connected:', sanitized)
=======
  console.log('MongoDB connected:', uri)
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
}
