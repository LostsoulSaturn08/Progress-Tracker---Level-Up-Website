// backend/controllers/userController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      // User doesn't exist — register them
      user = await prisma.user.create({
        data: {
          username,
          password, // 🚨 In production, hash this password!
        },
      });
      return res.status(201).json({ message: "User registered successfully", user });
    }

    // User exists — check password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    console.error("Login/Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser };
