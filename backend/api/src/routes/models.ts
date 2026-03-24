import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { uploadModel, getModels } from '../controllers/modelController'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ]
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only image uploads are allowed'))
    }
  },
})

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (err: unknown) => {
    if (err) {
      if (
        err instanceof Error &&
        err.message === 'Only image uploads are allowed'
      ) {
        res.status(400).json({ error: err.message })
        return
      }
      next(err)
      return
    }
    uploadModel(req, res)
  })
})
router.get('/', getModels)

export default router
