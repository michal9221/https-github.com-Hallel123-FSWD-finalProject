const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/login', userController.loginUser);
router.get('/:userId/paymentDetails', authenticateToken, userController.getPaymentDetails);

// Update user payment details
router.put('/:userId/paymentDetails', authenticateToken, userController.updatePaymentDetails);

module.exports = router;
