import { Router } from 'express'
import multer from 'multer'
import { uploadModel, getModels } from '../controllers/modelController'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('image'), uploadModel)
router.get('/', getModels)

export default router
