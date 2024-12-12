const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, cartController.getCartItems);
// router.post('/add', authenticateToken, cartController.addToCart);
router.delete('/remove/:productId', authenticateToken, cartController.removeFromCart);
router.put('/update/:productId', authenticateToken, cartController.updateCartItemQuantity);

module.exports = router;