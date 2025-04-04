import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { message, Spin, Layout, Typography, Grid } from "antd";
import PropTypes from "prop-types";
import { isAdmin } from "../api/authApi";

const { Content } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

/**
 * คอมโพเนนท์ตรวจสอบสิทธิ์การเข้าถึงหน้า
 * @param {React.ReactNode} children - คอมโพเนนท์ลูก
 * @param {boolean} requireAdmin - กำหนดว่าต้องการตรวจสอบสิทธิ์ admin หรือไม่
 * @returns {React.ReactNode} - คอมโพเนนท์ที่ควรแสดง
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const screens = useBreakpoint();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("กรุณาเข้าสู่ระบบ");
      setLoading(false);
      return;
    }

    // ตรวจสอบว่าต้องการสิทธิ์ admin หรือไม่
    if (requireAdmin && !isAdmin()) {
      message.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      setLoading(false);
      return;
    }

    // ผ่านการตรวจสอบสิทธิ์แล้ว
    setAuthorized(true);
    setLoading(false);
  }, [requireAdmin]);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: screens?.xs ? "0 16px" : "0 24px",
          }}
        >
          <Spin size={screens?.xs ? "default" : "large"} />
          <Title
            level={screens?.xs ? 5 : 4}
            style={{
              marginTop: screens?.xs ? 16 : 24,
              fontWeight: "normal",
              opacity: 0.65,
              textAlign: "center",
            }}
          >
            กำลังตรวจสอบสิทธิ์...
          </Title>
        </Content>
      </Layout>
    );
  }

  // หากไม่ผ่านการตรวจสอบสิทธิ์
  if (!authorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // แสดงเนื้อหาสำหรับผู้ใช้ที่ผ่านการตรวจสอบสิทธิ์
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
};

export default ProtectedRoute;
