const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options suppress deprecation warnings in Mongoose 7+
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
