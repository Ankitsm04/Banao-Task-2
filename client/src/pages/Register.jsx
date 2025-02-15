import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Redirecting to login...");
        navigate("/login");
      } else {
        setError(data.message || "Failed to register");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 shadow-md rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="border p-2 w-full mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border p-2 w-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <input
            type="password"
            placeholder="Confirm Password"
            className="border p-2 w-full mb-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="text-center mb-2 text-sm">Already Registered?
             <Link className="text-blue-600" to='/login'> Sign In</Link>
          </div>
          <button className="bg-blue-600 text-white p-2 w-full rounded">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
