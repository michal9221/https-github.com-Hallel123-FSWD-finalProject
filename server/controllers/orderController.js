
const Order = require('../models/orderModel');
const Product = require('../models/productModel');


exports.addToCart = async (req, res) => {
  
  const userId = req.user.id; 
  const { productId, quantity } = req.body;
  try {
    const stockQuantity = await Product.getStockQuantity(productId);
    if (stockQuantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock', 
        availableQuantity: stockQuantity 
      });
    }


    const cart = await Order.getOrCreateCart(userId);
    await Order.addProductToCart(cart.orderNumber, productId, quantity);

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

exports.getCurrentOrder = async (req, res) => {
    try {
        const userId = req.params.userId;
        const order = await Order.findCurrentOrder(userId);

        if (!order) {
            return res.status(404).json({ message: 'No current order found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error in getCurrentOrder:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.confirmOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { customerNumber, status, orderDate } = req.body;

        if (!customerNumber || !status || !orderDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedOrder = await Order.confirmOrder(orderId, customerNumber, status, orderDate);

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found or already confirmed' });
        }

        res.json({ message: 'Order confirmed successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error in confirmOrder:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

