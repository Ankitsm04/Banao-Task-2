import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">
        <Link to='/'>
        Social App
        </Link>
        </h1>
      <div>
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        ) : (
          <button onClick={() => navigate("/login")} className="bg-green-500 px-4 py-2 rounded">
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
