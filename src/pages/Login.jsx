import { Form, Input, Button, Card, Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../api/authApi";

const { Header, Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values);
      navigate("/admin/costumes");
    } catch (error) {
      console.log(error);
      toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
    setLoading(false);
  };

  return (
    <Layout
      style={{ height: "100dvh", display: "flex", flexDirection: "column" }}
    >
      {/* ✅ Navbar ด้านบน */}
      <Header
        style={{
          background: "#fff",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
          padding: "10px 0",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        Moso-Yodia Admin
      </Header>

      {/* ✅ Container ตรงกลาง */}
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Card
          title="เข้าสู่ระบบ"
          style={{
            width: 350,
            padding: 20,
            borderRadius: 8,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="ชื่อผู้ใช้" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="รหัสผ่าน"
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block>
              เข้าสู่ระบบ
            </Button>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
