import React, { useState, useEffect } from "react";

const TaskCard = ({ task, onArchive, onRemove, onUnarchive }) => {
  if (!task || typeof task !== "object") {
    console.error("Task data is invalid:", task);
    return null;
  }

  const [progress, setProgress] = useState(task.progress || 0);
  const totalIterations = task.total > 0 ? task.total : 1;
  const deadline = task.deadline ? new Date(task.deadline) : null;
  const [isArchived, setIsArchived] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (totalIterations > 0) {
      setProgress((task.progress / totalIterations) * 100);
    }

    // Check if task is already archived
    const history = JSON.parse(localStorage.getItem("taskHistory")) || [];
    setIsArchived(history.some((t) => t.text === task.text));
  }, [task.progress, totalIterations, task.text]);

  // Increase Progress
  const increaseProgress = () => {
    setProgress((prev) => Math.min(prev + (100 / totalIterations), 100));
  };

  // Decrease Progress
  const decreaseProgress = () => {
    setProgress((prev) => Math.max(prev - (100 / totalIterations), 0));
  };

  // Archive Task
  const archiveTask = () => {
    const history = JSON.parse(localStorage.getItem("taskHistory")) || [];

    if (!history.some((t) => t.text === task.text)) {
      history.push({ ...task, progress });
      localStorage.setItem("taskHistory", JSON.stringify(history));
    }

    setIsArchived(true);
    onArchive(task);
  };

  // Unarchive Task
  const unarchiveTask = () => {
    let history = JSON.parse(localStorage.getItem("taskHistory")) || [];
    history = history.filter((t) => t.text !== task.text);
    localStorage.setItem("taskHistory", JSON.stringify(history));

    setIsArchived(false);
    onUnarchive(task);
  };

  // **Remove Task from Active List & Archive**
  const removeTask = () => {
    setIsDeleted(true); // Hide Task Immediately

    onRemove(task);

    let history = JSON.parse(localStorage.getItem("taskHistory")) || [];
    history = history.filter((t) => t.text !== task.text);
    localStorage.setItem("taskHistory", JSON.stringify(history));
  };

  // **If Task is Deleted, Don't Render Anything**
  if (isDeleted) return null;

  return (
    <div className="p-4 shadow-lg rounded-2xl bg-gray-800 text-white text-center">
      <h2 className="text-xl font-bold mb-2">{task.text || "Untitled Task"}</h2>
      <p className="text-gray-400">
        Deadline: {deadline ? deadline.toDateString() : "No deadline"}
      </p>

      {/* Glass Bowl with Liquid Effect */}
      <div className="relative w-24 h-24 mx-auto mt-4 bg-gray-700 rounded-full overflow-hidden border-4 border-gray-500">
        <div
          className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all ease-in-out duration-300"
          style={{ height: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-gray-400">Progress: {progress.toFixed(2)}%</p>

      {/* Progress Control */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={increaseProgress}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          + Add Progress
        </button>
        <button
          onClick={decreaseProgress}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          - Remove Progress
        </button>
      </div>

      {/* Archive, Unarchive & Remove Buttons */}
      {progress >= 100 && (
        <>
          {!isArchived ? (
            <button
              onClick={archiveTask}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Archive Task
            </button>
          ) : (
            <button
              onClick={unarchiveTask}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Unarchive Task
            </button>
          )}
          <button
            onClick={removeTask}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Remove Task
          </button>
        </>
      )}
    </div>
  );
};

export default TaskCard;
