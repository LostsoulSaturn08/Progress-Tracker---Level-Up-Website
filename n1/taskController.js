const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const addTask = async (req, res) => {
  const { title, userId } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        user: { connect: { id: userId } }
      }
    });
    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
};

module.exports = { getTasks, addTask };
