import React, { useState, useEffect } from "react";

const Profile = ({ user, onLogout }) => {
  const [dp, setDp] = useState(user?.dp || "");
  const [isOpen, setIsOpen] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [archive, setArchive] = useState([]);

  // Load Archive from Local Storage
  const loadArchive = () => {
    const history = JSON.parse(localStorage.getItem("taskHistory")) || [];
    setArchive(history);
  };

  useEffect(() => {
    loadArchive(); // Load archive whenever the component mounts
  }, []);

  const handleDpUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be under 2MB");
        return;
      }

      const formData = new FormData();
      formData.append('profileImage', file); // Send image file

      try {
        const response = await fetch('http://localhost:5000/api/upload-profile-image', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${user.token}`, // Optional auth header
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Use the image URL returned by the backend (saved in the dp column)
          setDp(data.imageUrl); 
        } else {
          alert('Error uploading image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('An error occurred while uploading the image');
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center space-x-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
      >
        <img
          src={dp || "/default-avatar.png"} // Use default image if not set
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-blue-500"
        />
        <span className="text-white font-bold">{user?.username || "User"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50">
          <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-80">
            {/* Profile Picture Upload */}
            <label className="cursor-pointer relative w-24 h-24 mx-auto block">
              <img
                src={dp || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-blue-500"
              />
              <input type="file" className="hidden" onChange={handleDpUpload} />
              <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full text-xs">
                📷
              </div>
            </label>

            {/* Other Profile Content */}
            <p className="text-lg font-bold text-center mt-3">{user?.username || "User"}</p>
            <button
              onClick={onLogout}
              className="mt-2 text-red-400 hover:text-red-500 transition-all text-center w-full"
            >
              Logout
            </button>

            {/* Archive Section */}
            <button
              onClick={() => {
                setShowArchive(!showArchive);
                if (!showArchive) loadArchive(); // Reload archive when opening
              }}
              className="mt-4 w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-all"
            >
              {showArchive ? "Hide Archive" : "View Archive"}
            </button>

            {showArchive && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg max-h-40 overflow-y-auto">
                <h3 className="text-lg font-bold mb-2">Archived Tasks</h3>
                {archive.length > 0 ? (
                  <ul className="text-sm">
                    {archive.map((task, index) => (
                      <li key={index} className="border-b border-gray-700 py-1">
                        {task.text} - {new Date(task.deadline).toDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No archived tasks yet.</p>
                )}
              </div>
            )}

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
