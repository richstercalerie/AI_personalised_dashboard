const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Register new user (admin or normal user)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, isAdmin });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

});

// Login user and send JWT cookie
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin, email: user.email },
      "myverysecuresecretkey123",
      { expiresIn: '1d' }
    );

    // Set HTTP-only cookie
    res
  .cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

res.json({ message: 'Logged in successfully', token, success: user.isAdmin });

  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' ,success: false});
  }
});

// Logout user (clear cookie)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully', success: true });
});
router.get('/getUserData', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message, success: false });
  }
});



module.exports = router;