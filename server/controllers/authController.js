const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Manager = require('../models/managerModel');

exports.managerLogin = async (req, res) => {

  const { ID, password, adminCode } = req.body;

  try {
    const manager = await Manager.login(ID, password, adminCode);
    
    if (!manager) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: manager.ID, name: manager.name, profile_type: 'manager' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Manager logged in successfully',
      manager: { id: manager.ID, name: manager.name },
      token
    });
  } catch (error) {
    console.error('Manager login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {  // This line is causing the issue
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { 
        id: user.serialNumber, 
        email: user.email, 
        profile_type: user.profile_type 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    // Remove sensitive information before sending
    const userResponse = {
      serialNumber: user.serialNumber,
      email: user.email,
      fullName: user.fullName,
      profile_type: user.profile_type
    };

    res.status(200).json({ user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.signUp = async (req, res) => {
  const { fullName, email, password, paymentDetails, ID, profile_type } = req.body;

  try {
    // Server-side validation
    if (fullName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    if (paymentDetails.length < 10) {
      return res.status(400).json({ error: 'Invalid payment details' });
    }
    if (ID.length < 5) {
      return res.status(400).json({ error: 'ID must be at least 5 characters long' });
    }
    if (!['regular', 'institution', 'agent'].includes(profile_type)) {
      return res.status(400).json({ error: 'Invalid profile type' });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password,
      paymentDetails,
      ID,
      profile_type
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.serialNumber, email: newUser.email, profile_type: newUser.profile_type },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Prepare user response (excluding sensitive information)
    const userResponse = {
      serialNumber: newUser.serialNumber,
      fullName: newUser.fullName,
      email: newUser.email,
      profile_type: newUser.profile_type
    };

    res.status(201).json({ message: 'User created successfully', user: userResponse, token });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Server error during sign up' });
  }
};

