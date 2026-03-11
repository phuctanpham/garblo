import { Router } from 'express'
import multer from 'multer'
import { uploadModel, getModels } from '../controllers/modelController'

const router = Router()
<<<<<<< HEAD
<<<<<<< HEAD
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'image'))
    }
  },
})
=======
const upload = multer({ storage: multer.memoryStorage() })
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
const upload = multer({ storage: multer.memoryStorage() })
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)

router.post('/', upload.single('image'), uploadModel)
router.get('/', getModels)

export default router
