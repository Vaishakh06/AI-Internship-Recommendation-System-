// frontend/src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
// 1. Import your NEW auth hook
import { useAuth } from '../context/AuthContext.jsx';

// 2. Check for 'requiredRole' (which you use in App.jsx)
const ProtectedRoute = ({ children, requiredRole }) => {
  // 3. Get the user and loading state from your new context
  const { user, loading } = useAuth();
  const location = useLocation();

  // 4. While the context is loading, show a loading message
  if (loading) {
    return <div className="text-center p-10 text-white bg-[#171C1C]">Loading...</div>; 
  }

  // 5. If not loading and no user, redirect to login
  if (!user) {
    // 1. Not logged in: Redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 6. If a role is required and the user's role doesn't match, redirect
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to home page and pass an error message in the state
    return <Navigate to="/" state={{ error: "Access Denied: You are not an admin." }} replace />; 
  }

  // 7. If all checks pass, show the protected component
  return children;
};

export default ProtectedRoute;