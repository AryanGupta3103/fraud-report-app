// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const reportRoutes = require('./routes/reportRoutes'); // alias for routes/reports.js
//const riskRoutes = require('./routes/riskRoutes');
const cors = require('cors'); // if frontend & backend are on different ports
// const authMiddleware = require('./middleware/auth'); // Only needed if used globally

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors()); // enable cross-origin requests
app.use(express.json());

// Routes
app.use('/api/reports', reportRoutes); // contains Supabase token middleware internally
//app.use('/api/risk', riskRoutes);      // optional: protect this if needed

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
