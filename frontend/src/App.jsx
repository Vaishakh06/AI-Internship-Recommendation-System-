import { Routes, Route } from "react-router-dom";

// Routes
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotAuthorized from "./pages/NotAuthorized";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AppWrapper from "./components/AppWrapper";
import VerifyPage from "./pages/VerifyPage";


// ✅ Chatbot import
import Chatbot from "./components/Chatbot";

const App = () => {
  return (
    <>
      <Routes>
        {/* --- Public Routes --- */}
        <Route
          path="/"
          element={
            <AppWrapper>
              <Home />
              {/* ✅ Chatbot available on all pages */}
              <Chatbot />
            </AppWrapper>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage mode="admin" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/verify/:token" element={<VerifyPage />} />


        {/* --- Student Dashboard + Chatbot --- */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <AppWrapper>
                <StudentDashboard />
                <Chatbot />
              </AppWrapper>
            </ProtectedRoute>
          }
        />

        {/* --- Protected Profile Page --- */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppWrapper>
                <UserProfile />
                <Chatbot />
              </AppWrapper>
            </ProtectedRoute>
          }
        />

        {/* --- Admin Dashboard --- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AppWrapper>
                <AdminDashboard />
                <Chatbot />
              </AppWrapper>
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
