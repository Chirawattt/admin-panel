import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Costumes from "./pages/Costumes";
import Images from "./pages/Images";
import CostumeDetail from "./pages/CostumeDetail";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import Profile from "./pages/Profile";
import CostumeStatus from "./pages/CostumeStatus";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/users"
          element={<ProtectedRoute element={<Users />} />}
        />
        <Route
          path="/admin/users/:id"
          element={<ProtectedRoute element={<UserDetail />} />}
        />
        <Route
          path="/admin/costumes"
          element={<ProtectedRoute element={<Costumes />} />}
        />
        <Route
          path="/admin/costumes/:id"
          element={<ProtectedRoute element={<CostumeDetail />} />}
        />
        <Route
          path="/admin/images"
          element={<ProtectedRoute element={<Images />} />}
        />
        <Route
          path="/admin/costumestatus"
          element={<ProtectedRoute element={<CostumeStatus />} />}
        />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/admin/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
