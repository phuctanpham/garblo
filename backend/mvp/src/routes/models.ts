import { Router } from 'express'
import multer from 'multer'
import { uploadModel, getModels } from '../controllers/modelController'
import { ALLOWED_IMAGE_MIME_TYPES } from '../config/fileValidation'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
})

router.post('/', upload.single('image'), uploadModel)
router.get('/', getModels)

export default router
