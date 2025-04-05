// Navbar.jsx
import { Layout, Menu, Dropdown, Button, Drawer, Grid, theme } from "antd";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  UserOutlined,
  LogoutOutlined,
  FileImageOutlined,
  SkinOutlined,
  TagOutlined,
  MenuOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAdmin } from "../../api/authApi";
import "./Navbar.css"; // Import CSS file for additional styles

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { useToken } = theme;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userState, setUserState] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const { token } = useToken();
  const [userRole, setUserRole] = useState("user");

  const pathToKeyMap = {
    "/admin/costumes": "costumes",
    "/admin/costumes/status": "costume-status",
    "/admin/images": "images",
    "/admin/users": "users",
  };
  const currentKey = pathToKeyMap[location.pathname] || "costumes";

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("ออกจากระบบสำเร็จ!"); // toast แจ้งเตือน
      navigate("/login"); // ไปหน้า Login
    } catch {
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.error("โปรดเข้าสู่ระบบก่อนใช้งาน");
      navigate("/login");
      return;
    }

    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserState({
        username: user.username,
        userRole: user.userRole,
      });
      setUserRole(user.userRole || "user");
    }
  }, [navigate]);

  // เมนูทั่วไปสำหรับทุก role
  const commonMenuItems = [
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
  ];

  // เมนูสำหรับ admin เท่านั้น
  const adminMenuItems = [
    {
      key: "users",
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">จัดการบัญชีผู้ใช้</Link>,
    },
  ];

  // รวมเมนูตาม role
  const menuItems = isAdmin()
    ? [...commonMenuItems, ...adminMenuItems]
    : commonMenuItems;

  return (
    <Header
      className="navbar-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
        padding: screens.xs ? "0 10px" : "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: screens.xs ? 60 : 64,
      }}
    >
      <div
        className="navbar-logo-container"
        style={{ display: "flex", alignItems: "center" }}
      >
        {/* ปุ่มเมนูสำหรับมือถือ */}
        {!screens.md && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setIsDrawerOpen(true)}
            className="navbar-mobile-button"
            style={{ fontSize: "18px", marginRight: 8 }}
          />
        )}

        {/* โลโก้รูปภาพ */}
        <Link to="/admin/costumes" className="navbar-logo-link">
          <img
            src="/Moso-Yodia-Logo.png"
            alt="Logo"
            className="navbar-logo"
            style={{
              width: screens.xs ? 40 : 50,
              height: screens.xs ? 40 : 50,
              borderRadius: "50%",
            }}
          />
        </Link>

        {screens.sm && (
          <span
            className="navbar-title"
            style={{
              marginLeft: 12,
              fontWeight: "bold",
              fontSize: screens.md ? 18 : 16,
              display: screens.xs ? "none" : "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            Moso-Yodia
          </span>
        )}
      </div>

      {/* เมนูสำหรับเดสก์ท็อป */}
      {screens.md && (
        <Menu
          mode="horizontal"
          selectedKeys={[currentKey]}
          className="navbar-menu"
          style={{
            flex: 1,
            justifyContent: "center",
            border: "none",
            backgroundColor: "transparent",
          }}
          items={menuItems}
        />
      )}

      {/* Dropdown user menu */}
      <Dropdown
        menu={{
          items: [
            {
              key: "profile",
              label: (
                <div>
                  <div>{`สวัสดี ${userState.username || "ผู้ใช้"}`}</div>
                  <div style={{ color: "#999", fontSize: "0.8em" }}>
                    {userRole === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}
                  </div>
                </div>
              ),
              icon: <UserOutlined />,
              disabled: true,
            },
            {
              type: "divider",
            },
            {
              key: "logout",
              label: "ออกจากระบบ",
              icon: <LogoutOutlined />,
              onClick: handleLogout,
              danger: true,
            },
          ],
        }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button
          type="text"
          icon={<UserOutlined />}
          className="navbar-user-button"
          style={{
            borderRadius: 20,
            backgroundColor: token.colorPrimaryBg,
            color: token.colorPrimary,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            padding: screens.xs ? "4px 8px" : "4px 12px",
            height: screens.xs ? "32px" : "36px",
          }}
        >
          {screens.sm ? userState.username : null}
        </Button>
      </Dropdown>

      {/* Drawer สำหรับมือถือ */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/Moso-Yodia-Logo.png"
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <span style={{ whiteSpace: "nowrap" }}>Moso-Yodia</span>
          </div>
        }
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={screens.xs ? "85%" : 300}
        styles={{ body: { padding: 0 } }}
        className="navbar-drawer"
      >
        <div
          className="navbar-drawer-content"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Menu
            mode="vertical"
            selectedKeys={[currentKey]}
            items={menuItems}
            onClick={() => setIsDrawerOpen(false)}
            className="navbar-drawer-menu"
            style={{
              border: "none",
              borderRadius: 0,
              flex: 1,
            }}
          />

          <div
            className="navbar-drawer-footer"
            style={{
              padding: "12px 24px",
              borderTop: "1px solid #f0f0f0",
              marginTop: "auto",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                <UserOutlined style={{ marginRight: 8 }} />
                {userState.username || "ผู้ใช้"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.45)" }}>
                {userRole === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}
              </div>
            </div>

            <Button
              icon={<LogoutOutlined />}
              danger
              onClick={handleLogout}
              style={{ width: "100%" }}
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </Drawer>
    </Header>
  );
};

export default Navbar;
