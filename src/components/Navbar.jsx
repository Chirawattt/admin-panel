// Navbar.jsx
import { Layout, Menu, Dropdown, Button, Drawer } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  UserOutlined,
  LogoutOutlined,
  FileImageOutlined,
  SkinOutlined,
  TagOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userState, setUserState] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathToKeyMap = {
    "/admin/costumes": "costumes",
    "/admin/costumes/status": "costume-status",
    "/admin/images": "images",
  };
  const currentKey = pathToKeyMap[location.pathname] || "costumes";

  const handleLogout = async () => {
    try {
      localStorage.clear(); // ลบข้อมูลใน localStorage ทั้งหมด
      toast.success("ออกจากระบบสำเร็จ!"); // toast แจ้งเตือน
      navigate("/"); // ไปหน้า Login
    } catch {
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.error("โปรดเข้าสู่ระบบก่อนใช้งาน");
      navigate("/");
    }
    localStorage.getItem("username") &&
      setUserState({ username: localStorage.getItem("username") });
  }, [navigate]);

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        padding: "0 20px",
      }}
    >
      {/* ปุ่มเมนูสำหรับมือถือ */}
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setIsDrawerOpen(true)}
        className="mobile-menu-button"
        style={{ display: "none", fontSize: "20px" }}
      />

      {/* โลโก้รูปภาพ */}
      <img
        src="/Moso-Yodia-Logo.png"
        alt="Logo"
        style={{ width: 90, height: 90, borderRadius: "50%" }}
      />

      {/* เมนูสำหรับเดสก์ท็อป */}
      <Menu
        mode="horizontal"
        selectedKeys={[currentKey]}
        style={{ flex: 1, justifyContent: "center" }}
        className="desktop-menu"
        items={[
          {
            key: "costumes",
            icon: <SkinOutlined />,
            label: <Link to="/admin/costumes">จัดการชุด</Link>,
          },
          {
            key: "costume-status",
            icon: <TagOutlined />,
            label: <Link to="/admin/costumes/status">จัดการสถานะชุด</Link>,
          },
          {
            key: "images",
            icon: <FileImageOutlined />,
            label: <Link to="/admin/images">จัดการรูปภาพ</Link>,
          },
        ]}
      />
      {/* ใช้ menu แทน overlay */}
      <Dropdown
        menu={{
          items: [
            {
              key: "logout",
              label: "ออกจากระบบ",
              icon: <LogoutOutlined />,
              onClick: handleLogout,
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button icon={<UserOutlined />}>{userState.username}</Button>
      </Dropdown>

      {/* Drawer สำหรับมือถือ */}
      <Drawer
        title="เมนู"
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <Menu
          mode="vertical"
          selectedKeys={[currentKey]}
          items={[
            {
              key: "costumes",
              icon: <SkinOutlined />,
              label: <Link to="/admin/costumes">จัดการชุด</Link>,
            },
            {
              key: "costume-status",
              icon: <TagOutlined />,
              label: <Link to="/admin/costumes/status">จัดการสถานะชุด</Link>,
            },
            {
              key: "images",
              icon: <FileImageOutlined />,
              label: <Link to="/admin/images">จัดการรูปภาพ</Link>,
            },
          ]}
        />
      </Drawer>
    </Header>
  );
};

export default Navbar;
