/**
 * seed.js — populates the database with an admin user, a regular user,
 * and a handful of sample nodes for development and demo purposes.
 *
 * Usage:  node seed.js
 *         node seed.js --clear    (deletes all data first)
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User.model");
const Node = require("./src/models/Node.model");

const CLEAR = process.argv.includes("--clear");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("[Seed] Connected to MongoDB");

  if (CLEAR) {
    await User.deleteMany({});
    await Node.deleteMany({});
    console.log("[Seed] Cleared existing data");
  }

  // ── Create users ────────────────────────────────────────────────────────────
  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  const user = await User.create({
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    role: "user",
  });

  console.log("[Seed] Created users: admin@example.com / user@example.com");

  // ── Create sample nodes ──────────────────────────────────────────────────────
  const sampleNodes = [
    { name: "API Gateway",       description: "Entry point for all service requests.",    status: "active",   tags: ["gateway", "api"],      createdBy: admin._id },
    { name: "Auth Service",      description: "Handles JWT issuance and validation.",     status: "active",   tags: ["auth", "security"],    createdBy: admin._id },
    { name: "Notification Worker", description: "Sends email and push notifications.",   status: "pending",  tags: ["queue", "email"],      createdBy: user._id  },
    { name: "Legacy Importer",   description: "Deprecated CSV import utility.",           status: "inactive", tags: ["legacy", "migration"], createdBy: user._id  },
    { name: "Analytics Collector", description: "Aggregates usage metrics for reporting.", status: "active", tags: ["metrics", "analytics"], createdBy: admin._id },
  ];

  await Node.insertMany(sampleNodes);
  console.log(`[Seed] Created ${sampleNodes.length} sample nodes`);

  await mongoose.disconnect();
  console.log("[Seed] Done ✓");
};

seed().catch((err) => {
  console.error("[Seed] Error:", err.message);
  process.exit(1);
});
