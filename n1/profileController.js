const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = `/uploads/${req.file.filename}`; // Get the file path where image is saved

    // Assuming you're passing user ID from auth (JWT token)
    const userId = req.user.id;

    // Update the user's profile image path in the database
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        dp: filePath, // Save the relative image path in the dp column
      },
    });

    res.json({ message: 'Profile image uploaded successfully', imageUrl: filePath });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
};

module.exports = { uploadProfileImage };
