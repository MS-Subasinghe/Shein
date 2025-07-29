import Cart from '../models/cart.js';
import Clothes from '../models/Clothes.js';

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userID: userId }).populate('items.clothesId');
    
    if (!cart) {
      cart = new Cart({ userID: userId, items: [] });
      await cart.save();
    }

    const totalPrice = cart.items.reduce((total, item) => {
      const price = item.clothesId?.price || 0;
      return total + price * item.quantity;
    }, 0);

    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.json({ 
      cart, 
      totalPrice, 
      totalItems,
      message: 'Cart retrieved successfully'
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { clothesId, quantity = 1 } = req.body;

    if (!clothesId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid input', message: 'Valid clothesId and quantity are required' });
    }

    const clothes = await Clothes.findById(clothesId);
    if (!clothes) {
      return res.status(404).json({ error: 'Clothes item not found' });
    }

    let cart = await Cart.findOne({ userID: userId });
    if (!cart) {
      cart = new Cart({ userID: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item => 
      item.clothesId.toString() === clothesId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({ clothesId, quantity: parseInt(quantity) });
    }

    await cart.save();
    
    cart = await Cart.findOne({ userID: userId }).populate('items.clothesId');

    const totalPrice = cart.items.reduce((total, item) => {
      const price = item.clothesId?.price || 0;
      return total + price * item.quantity;
    }, 0);
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);

    res.json({ 
      cart, 
      totalPrice, 
      totalItems,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { userId, clothesId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity', message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userID: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.clothesId.toString() === clothesId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = parseInt(quantity);
    await cart.save();
    
    const updatedCart = await Cart.findOne({ userID: userId }).populate('items.clothesId');

    const totalPrice = updatedCart.items.reduce((total, item) => {
      const price = item.clothesId?.price || 0;
      return total + price * item.quantity;
    }, 0);
    const totalItems = updatedCart.items.reduce((total, item) => total + item.quantity, 0);

    res.json({ 
      cart: updatedCart, 
      totalPrice, 
      totalItems,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, clothesId } = req.params;
    
    const cart = await Cart.findOne({ userID: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.clothesId.toString() !== clothesId
    );
    
    await cart.save();
    
    const updatedCart = await Cart.findOne({ userID: userId }).populate('items.clothesId');

    const totalPrice = updatedCart.items.reduce((total, item) => {
      const price = item.clothesId?.price || 0;
      return total + price * item.quantity;
    }, 0);
    const totalItems = updatedCart.items.reduce((total, item) => total + item.quantity, 0);

    res.json({ 
      cart: updatedCart, 
      totalPrice, 
      totalItems,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let cart = await Cart.findOne({ userID: userId });
    if (!cart) {
      cart = new Cart({ userID: userId, items: [] });
      await cart.save();
    } else {
      cart.items = [];
      await cart.save();
    }

    res.json({ 
      cart, 
      totalPrice: 0, 
      totalItems: 0,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};
