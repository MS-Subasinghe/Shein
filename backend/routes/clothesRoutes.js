import express from 'express'
import { addClothes,deleteClothes,getALlClothes, getClothesByID, updateClothes } from '../controllers/clothesController.js'

const router = express.Router()

router.post('/', addClothes)

router.get('/getAllclothes',getALlClothes)

router.get('/id',getClothesByID)

router.delete('/:id', deleteClothes);

router.put('/:id', updateClothes)

export default router;