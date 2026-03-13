import mongoose from 'mongoose'

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/virtual-wardrobe'
  await mongoose.connect(uri)
  try {
    const parsed = new URL(uri)
    if (parsed.username) parsed.username = '***'
    if (parsed.password) parsed.password = '***'
    console.log('MongoDB connected:', parsed.toString())
  } catch {
    console.log('MongoDB connected')
  }
}
