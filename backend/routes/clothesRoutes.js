import express from 'express'
import { addClothes, deleteClothes, getALlClothes, getClothesByID, updateClothes } from '../controllers/clothesController.js'
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', verifyToken, isAdmin, addClothes)

router.get('/', getALlClothes)               // <-- changed from '/getAllclothes' to '/'
router.get('/:id', getClothesByID)           // <-- changed from '/id' to '/:id'

router.delete('/:id', verifyToken, isAdmin, deleteClothes)

router.put('/:id', verifyToken, isAdmin, updateClothes)

export default router
