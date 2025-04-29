// AddTaskHandler.jsx
import axios from "axios";

const addTaskHandler = async ({
  newTask,
  deadline,
  taskDuration,
  profile,
  setTasks,
  setNewTask,
  setTaskDuration,
}) => {
  if (newTask.trim() === "") return;

  const payload = {
    text: newTask,
    completed: false,
    deadline,
    progress: 0,
    total: taskDuration,
  };

  try {
    const response = await axios.post(
      "http://localhost:5000/api/tasks",
      payload,
      {
        headers: { Authorization: `Bearer ${profile?.token}` },
      }
    );

    const savedTask = response.data; // <-- this has real id, real fields

    // ✅ Correct: Add the saved task to state
    setTasks((prev) => [...prev, savedTask]);

  } catch (error) {
    console.error("Error saving task to backend:", error);
  }

  setNewTask("");
  setTaskDuration(1);
};

export default addTaskHandler;
