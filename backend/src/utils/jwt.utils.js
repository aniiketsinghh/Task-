const jwt = require("jsonwebtoken");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });


const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);


const buildUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

module.exports = { signToken, verifyToken, buildUserResponse };
