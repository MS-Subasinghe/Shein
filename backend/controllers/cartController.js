import Cart from '../models/cart.js';
import Clothes from '../models/Clothes.js';

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId }).populate('items.clothesId');
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    // Calculate total price and total items
    const totalPrice = cart.items.reduce((total, item) => {
      const price = item.clothesId?.price || 0;
      return total + price * item.quantity;
    }, 0);

    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.json({ cart, totalPrice, totalItems });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { clothesId, quantity } = req.body;

    if (!clothesId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const clothes = await Clothes.findById(clothesId);
    if (!clothes) return res.status(404).json({ error: 'Clothes item not found' });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const index = cart.items.findIndex(item => item.clothesId.toString() === clothesId);
    if (index === -1) {
      cart.items.push({ clothesId, quantity });
    } else {
      cart.items[index].quantity += quantity;
    }

    await cart.save();
    await cart.populate('items.clothesId').execPopulate();

    // Calculate totals after update
    const totalPrice = cart.items.reduce((total, item) => {
      const price = item.clothesId?.price || 0;
      return total + price * item.quantity;
    }, 0);
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.json({ cart, totalPrice, totalItems });
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { userId, clothesId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const index = cart.items.findIndex(item => item.clothesId.toString() === clothesId);
    if (index === -1) return res.status(404).json({ error: 'Item not found in cart' });

    cart.items[index].quantity = quantity;
    await cart.save();
    await cart.populate('items.clothesId').execPopulate();

    const totalPrice = cart.items.reduce((total, item) => {
      const price = item.clothesId?.price || 0;
      return total + price * item.quantity;
    }, 0);
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.json({ cart, totalPrice, totalItems });
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, clothesId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => item.clothesId.toString() !== clothesId);
    await cart.save();
    await cart.populate('items.clothesId').execPopulate();

    const totalPrice = cart.items.reduce((total, item) => {
      const price = item.clothesId?.price || 0;
      return total + price * item.quantity;
    }, 0);
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.json({ cart, totalPrice, totalItems });
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.json({ cart, totalPrice: 0, totalItems: 0 });
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};
