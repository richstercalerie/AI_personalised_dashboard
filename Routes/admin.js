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
router.get('/customers/:customerId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { customerId } = req.params;

    console.log( customerId);
    // Find customer by _id
    const customer = await Customer.findOne({ id: customerId }).select('-__v');
    console.log( customerId);

    // Verify adminId matches
    if (customer.adminId.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Unauthorized access to this customer' });
    }

    res.status(200).json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
module.exports = router;