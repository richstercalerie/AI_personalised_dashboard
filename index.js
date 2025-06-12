const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const customerRoutes = require('./Routes/customer');
const cookieParser = require('cookie-parser');
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://ai-dashboard-frontend-ten.verce.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.use(cookieParser());
const authRoutes = require('./Routes/auth');
const adminRoutes = require('./Routes/admin');
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', customerRoutes);

const userRoutes = require('./Routes/user');
app.use('/api', userRoutes);
const PORT = process.env.PORT || 8181;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));