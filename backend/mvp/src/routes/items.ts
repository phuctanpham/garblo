import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { uploadItem, getItems } from '../controllers/itemController'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
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
    uploadItem(req, res)
  })
})
router.get('/', getItems)

export default router
