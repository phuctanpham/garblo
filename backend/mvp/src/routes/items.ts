import { Router } from 'express'
import multer from 'multer'
import { uploadItem, getItems } from '../controllers/itemController'

const router = Router()
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)
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
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname))
    }
  },
})
=======
const upload = multer({ storage: multer.memoryStorage() })
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
<<<<<<< HEAD
=======
const upload = multer({ storage: multer.memoryStorage() })
>>>>>>> aae9bf2 (feat(mvp): implement backend MVP with controllers, services, and tests)
=======
>>>>>>> fd8b683 (feat(mvp): implement backend MVP with controllers, services, and tests)

<<<<<<< HEAD
router.post('/', upload.single('image'), uploadItem)
=======
<<<<<<< HEAD
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (err?: Error) => {
    if (err) {
      if (
        err instanceof Error &&
        err.message === 'Only image uploads are allowed'
      ) {
        return res.status(400).json({ error: err.message })
      }
      return next(err)
    }
    uploadItem(req, res)
  })
})
=======
router.post('/', upload.single('image'), uploadItem)
>>>>>>> 4469530 (fix: apply all remaining PR review comment fixes)
>>>>>>> 9614619 (fix: apply all remaining PR review comment fixes)
router.get('/', getItems)

export default router
