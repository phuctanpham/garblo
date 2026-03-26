import mongoose from 'mongoose'

export async function connectDB(): Promise<void> {
  const uri =
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/virtual-wardrobe'
  await mongoose.connect(uri)
  // Log a sanitized URI to avoid leaking credentials in output
  const sanitized = uri.replace(/:\/\/[^@]+@/, '://<credentials>@')
  console.log('✅ MongoDB connected:', sanitized)
}
