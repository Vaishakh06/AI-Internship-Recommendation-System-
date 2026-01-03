import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Adjust path if needed

const LogoIcon = () => (
  <svg className="w-8 h-8 text-white-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.002 1.79l7 3.5a1 1 0 00.786 0l7-3.5a1 1 0 00.002-1.79l-7-3.5zM3 9.38l7 3.5 7-3.5v3.83l-7 3.5-7-3.5V9.38z"></path>
    <path d="M10 12.65l-7-3.5v.03A1.002 1.002 0 002 10v5a1 1 0 001 1h14a1 1 0 001-1v-5a1 1 0 00-.002-1.09v-.03l-7 3.5z"></path>
  </svg>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-gray-900 bg-opacity-50 border-b border-gray-700/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">


        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-2 group">
          <LogoIcon />
          {/* Optional: Add text next to logo, appears on hover */}
          <span className="text-3xl font-bold text-blue-400 hidden sm:inline group-hover:text-yellow-300 transition-colors">
            Intern Desk
          </span>
        </Link>
        {/* ------------ */}

        <nav>
          {user ? ( // If the user is logged in
            <div className="flex items-center gap-4">

              {/* --- THIS IS THE LINK YOU SHOULD SEE --- */}
              <Link
                to="/profile"
                className="text-gray-300 hover:text-yellow-400 font-semibold transition-colors"
              >
                My Profile
              </Link>
              {/* -------------------------------------- */}

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : ( // If no user is logged in
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;