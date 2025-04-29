const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1h' }
  );
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        dp: true, // ✅ return dp
      },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          dp: true, // ✅ include dp (will be null)
        },
      });

      const token = generateToken(newUser);
      return res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });

  } catch (error) {
    console.error('Login/Register error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser };
