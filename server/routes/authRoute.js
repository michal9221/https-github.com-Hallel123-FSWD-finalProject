const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginUser);
router.post('/signup', authController.signUp);
router.post('/manager-login', authController.managerLogin);

module.exports = router;