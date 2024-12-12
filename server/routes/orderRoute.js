const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, checkInstitutionOrder } = require('../middleware/authMiddleware');

router.post('/add-to-cart', authenticateToken, checkInstitutionOrder, orderController.addToCart);


// Get current order for a user
router.get('/current/:userId', authenticateToken, orderController.getCurrentOrder);

// Confirm an order
router.put('/:orderId/confirm', authenticateToken, orderController.confirmOrder);

module.exports = router;

