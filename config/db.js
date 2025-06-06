const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://anurag17sw:Anurag17sw@sbilife.tytjqay.mongodb.net/?retryWrites=true&w=majority&appName=sbilife");
    console.log("MongoDB connected.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;