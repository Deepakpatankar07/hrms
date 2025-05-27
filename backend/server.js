const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/db');

const PORT = process.env.PORT || 5000;

mongoose.connect(config.mongoURI || "mongodb://localhost:27017/hrms")
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));