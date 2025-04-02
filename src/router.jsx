import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Costumes from "./pages/Costumes";
import CostumeStatus from "./pages/CostumeStatus";
import Images from "./pages/Images";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/costumes" element={<Costumes />} />
        <Route path="/admin/costumes/status" element={<CostumeStatus />} />
        <Route path="/admin/images" element={<Images />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
