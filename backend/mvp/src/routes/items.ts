import { Router } from 'express'
import multer from 'multer'
import { uploadItem, getItems } from '../controllers/itemController'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image uploads are allowed'))
    }
  },
})

router.post('/', upload.single('image'), uploadItem)
router.get('/', getItems)

export default router
