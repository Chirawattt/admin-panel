import { useState, useEffect } from "react";
import { Dropdown, Menu, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { logout } from "../api/authApi";

const Navbar = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "ผู้ใช้");
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    toast.success("ออกจากระบบสำเร็จ");
    window.location.href = "/login";
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={userMenu} trigger={["click"]}>
      <Button icon={<UserOutlined />}>{username}</Button>{" "}
      {/* ✅ เปลี่ยนเป็นชื่อจริง */}
    </Dropdown>
  );
};

export default Navbar;
