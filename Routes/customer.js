const axios = require('axios');
const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/customer', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const churn_data={
        'Age':req.body.Age,
        'Annual_Premium':req.body.Annual_Premium,
        'Previously_Insured':req.body.Previously_Insured,
        'Vehicle_Damage':req.body.Vehicle_Damage,
        'Region_Code':req.body.Region_Code,
        'Policy_Sales_Channel':req.body.Policy_Sales_Channel,
        'Vintage':req.body.Vintage,
        'Gender':req.body.Gender,
    }
    const churn_response = await axios.post('https://sbilife-churnmodel.onrender.com/predict_churn', churn_data);
    if(churn_response.data.churn_probablity>50){
        req.body.status = 'Inactive';
        req.body.churnRisk = 'High Risk';
    }
    else if(churn_response.data.churn_probablity>30 && churn_response.data.churn_probablity<=50){
        req.body.status = 'Inactive';
        req.body.churnRisk = 'Medium Risk';
    }
    else{
        req.body.status = 'Active';
        req.body.churnRisk = 'Low Risk';
    }
    const customer = new Customer({
  ...req.body,
  churnProbability: churn_response.data.churn_probability, // ✅ corrected
  prediction: churn_response.data.prediction,
  adminId: req.user._id 
    });
    await customer.save();
    res.status(201).json({ message: 'Customer saved!', customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;