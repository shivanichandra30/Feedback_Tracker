import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-wide">
        Feedback Tracker
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        aria-label="Logout"
      >
        Logout
      </button>
    </nav>
  );
}
