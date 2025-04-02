// Navbar.jsx
import { Layout, Menu, Dropdown, Button, Drawer } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  FileImageOutlined,
  SkinOutlined,
  TagOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const Navbar = ({
  username,
  onLogout,
  onMenuClick,
  isDrawerOpen,
  onCloseDrawer,
}) => {
  const location = useLocation();
  const pathToKeyMap = {
    "/admin/costumes": "costumes",
    "/admin/costumes/status": "costume-status",
    "/admin/images": "images",
  };
  const currentKey = pathToKeyMap[location.pathname] || "costumes";

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
        onClick={onMenuClick}
        style={{ display: "none", fontSize: "20px" }}
        className="menu-button"
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
              onClick: onLogout,
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button icon={<UserOutlined />}>{username}</Button>
      </Dropdown>

      {/* Drawer สำหรับมือถือ */}
      <Drawer
        title="เมนู"
        placement="left"
        onClose={onCloseDrawer}
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
