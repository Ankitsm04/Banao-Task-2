import { useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset link has been sent to your email!");
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 shadow-md rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Forget Password</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleForgetPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white p-2 w-full rounded">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
