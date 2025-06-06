const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully.' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;