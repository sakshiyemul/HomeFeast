const bcrypt = require("bcryptjs");
const User = require("../models/User");

const ADMIN_EMAIL = "admin@homefeast.com";
const ADMIN_PASSWORD = "homefeast@123";
const ADMIN_NAME = "HomeFeast Admin";

async function seedAdmin() {
  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("✅ Admin user already exists:", ADMIN_EMAIL);
      return;
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin"
    });

    console.log("🌱 Admin user seeded successfully:", ADMIN_EMAIL);
  } catch (err) {
    console.error("❌ Failed to seed admin user:", err.message);
  }
}

module.exports = seedAdmin;
