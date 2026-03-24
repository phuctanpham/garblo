import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import multer from 'multer'
import { connectDB } from './utils/db'
import itemRoutes from './routes/items'
import modelRoutes from './routes/models'
import outfitRoutes from './routes/outfits'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'public', 'uploads')),
)

app.use('/api/items', itemRoutes)
app.use('/api/models', modelRoutes)
app.use('/api/outfits', outfitRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Centralized error handler: maps Multer errors (incl. fileFilter rejections) to 400
app.use((err: Error, _req: Request, res: Response) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message })
    return
  }
  res.status(500).json({ error: err.message })
})

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`),
    )
  })
  .catch((err: Error) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
