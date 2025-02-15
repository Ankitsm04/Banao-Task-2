import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Navbar from "../components/Navbar";
import ForgetPassword from "../pages/Forget-Password";
import ResetPassword from "../pages/Reset-Password";
import CreatePost from "../pages/CreatePost";

const AppRouter = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/create" element={<CreatePost/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
