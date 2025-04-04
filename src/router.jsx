import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Costumes from "./pages/Costumes";
import CostumeStatus from "./pages/CostumeStatus";
import Images from "./pages/Images";
import Users from "./pages/Users";
import ProtectedRoute from "./routes/ProtectedRoute";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* รายการทั่วไป */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* รายการที่ต้องเข้าสู่ระบบ */}
        <Route
          path="/admin/costumes"
          element={
            <ProtectedRoute>
              <Costumes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/costumes/status"
          element={
            <ProtectedRoute>
              <CostumeStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/images"
          element={
            <ProtectedRoute>
              <Images />
            </ProtectedRoute>
          }
        />

        {/* รายการที่ต้องเป็น Admin */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/admin/costumes" replace />} />
        <Route path="*" element={<Navigate to="/admin/costumes" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
