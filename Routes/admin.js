const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Get all customers under the logged-in admin
router.get('/customers', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const customers = await Customer.find({ adminId: req.user._id });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;