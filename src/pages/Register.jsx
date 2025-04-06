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
  MailOutlined,
  UserAddOutlined,
  FileOutlined,
  LockFilled,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../api/authApi";
import logo from "../assets/logo.png";
import TermsModal from "../components/shared/TermsModal";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    setAgreeTerms(e.target.checked);
  };

  const handleViewTerms = () => {
    setShowTermsModal(true);
  };

  const handleAcceptTerms = () => {
    setAgreeTerms(true);
    setShowTermsModal(false);
    localStorage.setItem("acceptedTerms", "true");
    toast.success("คุณได้ยอมรับเงื่อนไขการใช้งานแล้ว");
  };

  const handleCancelTerms = () => {
    setShowTermsModal(false);
    // ไม่ตั้งค่า agreeTerms เป็น true เพราะผู้ใช้ไม่ยอมรับเงื่อนไข
  };

  const onFinish = async (values) => {
    if (!agreeTerms) {
      toast.error("กรุณายอมรับเงื่อนไขการใช้งานก่อนดำเนินการต่อ");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // ตรวจสอบรหัสผ่านว่าตรงกัน
      if (values.password !== values.confirmPassword) {
        throw new Error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      }

      // ส่งข้อมูลไปยัง API โดยไม่รวม confirmPassword
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role || "user",
      };

      await register(userData);

      // แสดงข้อความสำเร็จ
      toast.success("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      navigate("/login");
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
          className="register-card"
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
            <Title level={2}>สมัครสมาชิก</Title>
            <Text type="secondary">สร้างบัญชีเพื่อใช้งานระบบจัดการร้าน</Text>
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
              role: "user", // ค่าเริ่มต้นเป็น user
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
              label="อีเมล"
              name="email"
              rules={[
                { required: true, message: "กรุณากรอกอีเมล" },
                { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="อีเมล"
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

            <Form.Item
              label="ยืนยันรหัสผ่าน"
              name="confirmPassword"
              rules={[
                { required: true, message: "กรุณายืนยันรหัสผ่าน" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="ยืนยันรหัสผ่าน"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Checkbox checked={agreeTerms} onChange={handleCheckboxChange}>
                ฉันได้อ่านและยอมรับ{" "}
                <Button
                  type="link"
                  size="small"
                  onClick={handleViewTerms}
                  style={{ padding: "0 4px" }}
                >
                  เงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
                </Button>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{ height: 45 }}
                disabled={!agreeTerms}
                icon={<UserAddOutlined />}
              >
                {loading ? <Spin /> : "สมัครสมาชิก"}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: "16px 0" }}>
            <Text type="secondary">หรือ</Text>
          </Divider>

          <div style={{ textAlign: "center" }}>
            <Text>มีบัญชีอยู่แล้ว? </Text>
            <Link to="/login" style={{ fontWeight: "bold" }}>
              เข้าสู่ระบบ
            </Link>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#888",
              marginTop: "16px",
            }}
          >
            <div>
              การสมัครสมาชิกถือว่าคุณยอมรับ{" "}
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

export default Register;
