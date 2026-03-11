import { Router } from 'express'
import { generateOutfit, getOutfits } from '../controllers/outfitController'

const router = Router()

router.post('/generate', generateOutfit)
router.get('/', getOutfits)

export default router
