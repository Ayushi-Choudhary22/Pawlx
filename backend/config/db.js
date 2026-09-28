const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / ISP DNS causing querySrv ECONNREFUSED on mongodb+srv://
// In Linux/cloud environments (Render), rely on the container's native /etc/resolv.conf
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    // Ignore if custom DNS cannot be set
  }
}

/**
 * Establishes connection to MongoDB using Mongoose.
 * Exits the process on failure since the API cannot function without a DB.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
