import express from 'express';
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId/add', addToCart);
router.put('/:userId/update/:clothesId', updateQuantity);
router.delete('/:userId/remove/:clothesId', removeFromCart);
router.post('/:userId/clear', clearCart);

export default router;
