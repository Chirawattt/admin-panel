import {
  Form,
  Input,
  Button,
  Card,
  Layout,
  Typography,
  Checkbox,
  Image,
  Divider,
  Spin,
  Alert,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  FileOutlined,
  LockFilled,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../api/authApi";
import logo from "../assets/logo.png"; // ต้องมีโลโก้ในโฟลเดอร์ assets
import TermsModal from "../components/shared/TermsModal";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  // โหลดค่า username ที่บันทึกไว้เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      form.setFieldsValue({
        username: rememberedUser,
      });
      setRememberMe(true);
    }
  }, [form]);

  const handleRememberChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleAcceptTerms = () => {
    // บันทึกว่าผู้ใช้ได้ยอมรับเงื่อนไขแล้ว
    localStorage.setItem("acceptedTerms", "true");
    setShowTermsModal(false);
    toast.success("คุณได้ยอมรับเงื่อนไขการใช้งานแล้ว");
  };

  const handleCancelTerms = () => {
    // เพียงแค่ปิด modal โดยไม่มีการแจ้งเตือนใดๆ
    setShowTermsModal(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError("");
    try {
      // จัดการกับการจดจำชื่อผู้ใช้
      if (rememberMe) {
        localStorage.setItem("rememberedUser", values.username);
      } else {
        localStorage.removeItem("rememberedUser");
      }

      // เรียก API login
      await login(values);

      // นำทางไปหน้าต่อไป
      navigate("/admin/costumes");
    } catch (error) {
      setError(error);
      toast.error(error);
    }
    setLoading(false);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
      }}
    >
      {/* Navbar ด้านบน */}
      <Header
        style={{
          background: "#fff",
          textAlign: "center",
          padding: "10px 0",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            src={logo}
            preview={false}
            width={40}
            style={{ borderRadius: "50%" }}
          />
          <Title level={3} style={{ margin: 0 }}>
            Moso-Yodia Admin
          </Title>
        </div>
      </Header>

      {/* Container ตรงกลาง */}
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "12px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Card
          className="login-card"
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 12,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            margin: "10px 0",
          }}
          styles={{
            body: {
              padding: "20px",
              "@media screen and (maxWidth: 576px)": {
                padding: "12px",
              },
            },
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2}>เข้าสู่ระบบ</Title>
            <Text type="secondary">กรอกข้อมูลเพื่อเข้าสู่ระบบจัดการร้าน</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              closable
              onClose={() => setError("")}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              remember: false,
            }}
          >
            <Form.Item
              label="ชื่อผู้ใช้"
              name="username"
              rules={[
                { required: true, message: "กรุณากรอกชื่อผู้ใช้" },
                { min: 3, message: "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="ชื่อผู้ใช้"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="รหัสผ่าน"
              name="password"
              rules={[
                { required: true, message: "กรุณากรอกรหัสผ่าน" },
                { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="รหัสผ่าน"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox checked={rememberMe} onChange={handleRememberChange}>
                  จดจำฉัน
                </Checkbox>
                <Link to="/forgot-password" style={{ fontWeight: "bold" }}>
                  ลืมรหัสผ่าน?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{ height: 45 }}
              >
                {loading ? <Spin /> : "เข้าสู่ระบบ"}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: "16px 0" }}>
            <Text type="secondary">หรือ</Text>
          </Divider>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <Text>ยังไม่มีบัญชี? </Text>
            <Link to="/register" style={{ fontWeight: "bold" }}>
              สมัครสมาชิก
            </Link>
          </div>

          <div style={{ textAlign: "center", fontSize: "13px", color: "#888" }}>
            <div>
              การเข้าใช้งานระบบถือว่าคุณยอมรับ{" "}
              <Button
                type="link"
                size="small"
                onClick={() => setShowTermsModal(true)}
                style={{ padding: "0 4px", fontSize: "13px" }}
              >
                <FileOutlined /> เงื่อนไขการใช้งาน
              </Button>{" "}
              และ{" "}
              <Button
                type="link"
                size="small"
                onClick={() => setShowTermsModal(true)}
                style={{ padding: "0 4px", fontSize: "13px" }}
              >
                <LockFilled /> นโยบายความเป็นส่วนตัว
              </Button>
            </div>
            <div style={{ marginTop: 8 }}>
              <Button
                type="link"
                size="small"
                onClick={() => setShowTermsModal(true)}
                style={{ padding: 0 }}
              >
                อ่านเงื่อนไขการใช้งาน
              </Button>
            </div>
          </div>
        </Card>
      </Content>

      {/* Terms Modal */}
      <TermsModal
        visible={showTermsModal}
        onAccept={handleAcceptTerms}
        onCancel={handleCancelTerms}
      />
    </Layout>
  );
};

export default Login;
