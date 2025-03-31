import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Costumes from "./pages/Costumes";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/costumes" element={<Costumes />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
