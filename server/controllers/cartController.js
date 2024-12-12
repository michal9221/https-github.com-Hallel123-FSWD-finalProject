const Cart = require('../models/cartModel');

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is attached to the request by the auth middleware
    const cartItems = await Cart.getCartItems(userId);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error in getCartItems:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    await Cart.removeFromCart(userId, productId);
    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    await Cart.updateCartItemQuantity(userId, productId, quantity);
    res.status(200).json({ message: 'Cart item quantity updated successfully' });
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error);
    res.status(500).json({ error: 'Server error' });
  }
};