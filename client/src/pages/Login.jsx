import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        alert("Login successful!");
        navigate("/");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 shadow-md rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="border p-2 w-full mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-center mb-2 text-sm">Not Registered?
             <Link className="text-blue-600" to='/register'> Sign Up</Link>
          </div>
          <div className="text-center mb-2 text-sm">
             <Link className="text-blue-600" to='/forget-password'>
             Forgot Password?</Link>
          </div>
          <button className="bg-blue-600 text-white p-2 w-full rounded">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
