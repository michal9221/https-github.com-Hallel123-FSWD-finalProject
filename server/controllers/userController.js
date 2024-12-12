const e = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, profile_type: user.profile_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ user: { id: user.id, email: user.email, profile_type: user.profile_type }, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



exports.getPaymentDetails = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ paymentDetails: user.paymentDetails });
  } catch (error) {
      console.error('Error in getPaymentDetails:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePaymentDetails = async (req, res) => {
  try {
      const userId = req.params.userId;
      const { paymentDetails } = req.body;

      if (!paymentDetails) {
          return res.status(400).json({ message: 'Payment details are required' });
      }

      const updatedUser = await User.updatePaymentDetails(userId, paymentDetails);

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'Payment details updated successfully', paymentDetails: updatedUser.paymentDetails });
  } catch (error) {
      console.error('Error in updatePaymentDetails:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

