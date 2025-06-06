const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  id: { type:mongoose.Schema.Types.ObjectId, required: true, unique: true },
  name: String,
  email: String,
  Age: Number,
  phone:{
    type: mongoose.Schema.Types.Mixed,
    required: true,
    
  },
  Vehicle_Damage: Boolean,
  Previously_Insured: Boolean,
  Gender: Boolean,
  Annual_Premium: Number,
  Policy_Sales_Channel: Number,
  Vintage: Number,	
  policyNumber: String,
  policyType: String,
  status: String,
  churnRisk: String,
  churnProbability: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  prediction: String,
  Region_Code: Number,
  customerSince: String,
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Admin' depending on your user model name
    required: true
  }
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;