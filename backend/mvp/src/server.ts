import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from './utils/db'
import itemRoutes from './routes/items'
import modelRoutes from './routes/models'
import outfitRoutes from './routes/outfits'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')))

app.use('/api/items', itemRoutes)
app.use('/api/models', modelRoutes)
app.use('/api/outfits', outfitRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
  })
  .catch((err: Error) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
