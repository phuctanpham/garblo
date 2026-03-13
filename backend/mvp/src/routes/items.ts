import { Router } from 'express'
import multer from 'multer'
import { uploadItem, getItems } from '../controllers/itemController'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('image'), uploadItem)
router.get('/', getItems)

export default router
