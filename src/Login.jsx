import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: username,
        password: password
      });
  
      // Handle successful login (update the state, redirect, etc.)
      console.log("Login successful:", response.data);
      onLogin(response.data); // Pass response data to parent component
  
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        if (error.response.status === 401) {
          alert("Invalid credentials. Please try again.");
        } else {
          alert("Login failed. Please try again.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 p-6 border border-blue-500 rounded-lg bg-gray-900">
        <input
          type="text"
          placeholder="Username"
          className="p-3 text-black rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 text-black rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg shadow-lg">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
