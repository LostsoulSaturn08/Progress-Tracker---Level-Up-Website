import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Profile from "./Profile";
import Login from "./Login";
import TaskCard from "./TaskCard";
import axios from "axios";

const ProgressTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [taskDuration, setTaskDuration] = useState(1);
  const [profile, setProfile] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (user) => {
    setProfile(user);
    setLoggedIn(true);
  };

  const addTask = async () => {
    if (newTask.trim() === "") return;

    const newTaskData = {
      text: newTask,
      completed: false,
      deadline,
      progress: 0,
      total: taskDuration,
    };

    // Optimistically update UI
    setTasks((prevTasks) => [...prevTasks, newTaskData]);

    try {
      const response = await axios.post("http://localhost:5000/api/tasks", newTaskData);
      console.log("Task saved to backend:", response.data);
    } catch (error) {
      console.error("Error saving task to backend:", error);
    }

    setNewTask("");
    setTaskDuration(1);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (loggedIn) fetchTasks();
  }, [loggedIn]);

  return (
    <div className="relative p-4 bg-black text-white min-h-screen font-mono">
      <h1 className="relative text-4xl mb-6 border-b-2 border-blue-500 pb-2">Progress Tracker</h1>

      {loggedIn && profile && (
        <div className="relative top-0 left-0 p-4">
          <Profile user={profile} onLogout={() => setLoggedIn(false)} />
        </div>
      )}

      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : !profile ? (
        <Profile onSave={setProfile} />
      ) : (
        <>
          <div className="relative flex flex-wrap gap-4 mb-6 items-center">
            <input
              type="text"
              className="p-3 text-black rounded-lg border border-blue-500 w-full md:w-1/3"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new quest..."
            />
            <input
              type="number"
              className="p-3 text-black rounded-lg border border-blue-500 w-full md:w-1/6"
              value={taskDuration}
              onChange={(e) => setTaskDuration(parseInt(e.target.value))}
              placeholder="Duration/Iterations"
            />

            <div className="w-full md:w-auto">
              <div className="border border-blue-500 bg-gray-800 p-4 rounded-lg shadow-lg">
                <Calendar
                  onChange={setDeadline}
                  value={deadline}
                  className="w-full max-w-xs text-lg font-bold rounded-lg"
                />
              </div>
            </div>

            <button className="bg-blue-600 px-4 py-2 rounded-lg shadow-lg w-full md:w-auto" onClick={addTask}>
              Add Quest
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task, index) => (
              <TaskCard key={index} task={task} />
            ))}
          </div>
        </>
      )}

      <style>{`
        .react-calendar {
          background-color: #1f2937 !important;
          color: white !important;
          border-radius: 8px;
        }
        .react-calendar__tile {
          color: white !important;
        }
        .react-calendar__navigation button {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default ProgressTracker;