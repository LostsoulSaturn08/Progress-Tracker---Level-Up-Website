import React, { useState, useEffect } from "react";

const Archive = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("taskHistory")) || [];
    setArchivedTasks(history);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("taskHistory");
    setArchivedTasks([]);
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Archived Tasks</h2>
      {archivedTasks.length === 0 ? (
        <p className="text-gray-400">No archived tasks yet.</p>
      ) : (
        <ul className="space-y-2">
          {archivedTasks.map((task, index) => (
            <li key={index} className="p-3 bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{task.text}</h3>
              <p className="text-gray-400">Completed on: {new Date(task.deadline).toDateString()}</p>
            </li>
          ))}
        </ul>
      )}
      {archivedTasks.length > 0 && (
        <button
          onClick={clearHistory}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Clear History
        </button>
      )}
    </div>
  );
};

export default Archive;
