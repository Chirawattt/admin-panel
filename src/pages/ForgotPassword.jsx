import {
  Form,
  Input,
  Button,
  Card,
  Layout,
  Typography,
  Steps,
  Alert,
  Image,
  Divider,
  Spin,
} from "antd";
import { MailOutlined, LockOutlined, NumberOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
import { requestOTP, resetPassword } from "../api/authApi";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);

  // ฟังก์ชั่นสำหรับการขอรหัส OTP
  const handleRequestOTP = async (values) => {
    setLoading(true);
    setError("");
    try {
      // ส่งคำขอ OTP ไปยัง Gmail
      const res = await requestOTP({
        email: values.email,
      });

      setEmail(values.email);

      // เริ่มนับถอยหลัง
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // ทุกๆ 1 วินาที จะลดค่า countdown ลง 1

      toast.success(res.message);

      // ไปยังขั้นตอนถัดไป
      setCurrentStep(1);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  // ฟังก์ชั่นสำหรับการยืนยัน OTP และตั้งรหัสผ่านใหม่
  const handleResetPassword = async (values) => {
    setLoading(true);
    setError("");
    try {
      // ตรวจสอบว่ารหัสผ่านตรงกัน
      if (values.newPassword !== values.confirmPassword) {
        setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
        setLoading(false);
        return;
      }

      // ส่งคำขอตั้งรหัสผ่านใหม่พร้อม OTP
      const res = await resetPassword({
        email: email,
        otp: values.otp,
        newPassword: values.newPassword,
      });

      toast.success(res.message);

      // นำไปยังหน้าเข้าสู่ระบบ
      navigate("/login");
    } catch (error) {
      setError(error);
      toast.error(error);
    }
    setLoading(false);
  };

  // ฟังก์ชั่นสำหรับขอรหัส OTP ใหม่
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      await requestOTP({
        email: email,
      });

      // เริ่มนับถอยหลังใหม่
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success("รหัส OTP ใหม่ถูกส่งไปยังอีเมลของคุณแล้ว");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("ไม่สามารถส่งรหัส OTP ใหม่ได้ กรุณาลองใหม่อีกครั้ง");
    }
    setLoading(false);
  };

  // ย้อนกลับไปขั้นตอนก่อนหน้า
  const handleGoBack = () => {
    setCurrentStep(0);
    setError("");
  };

  // แสดงขั้นตอนต่างๆ ตาม currentStep
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form layout="vertical" form={form} onFinish={handleRequestOTP}>
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
                placeholder="อีเมลที่ใช้ลงทะเบียน"
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{ height: 45 }}
              >
                {loading ? <Spin /> : "ขอรหัส OTP"}
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <Form layout="vertical" form={form} onFinish={handleResetPassword}>
            <Paragraph>
              รหัส OTP ได้ถูกส่งไปยังอีเมล {email.substring(0, 3)}
              ***{email.substring(email.indexOf("@"))}
            </Paragraph>

            <Form.Item
              label="รหัส OTP"
              name="otp"
              rules={[
                { required: true, message: "กรุณากรอกรหัส OTP" },
                {
                  pattern: /^[0-9]{6}$/,
                  message: "รหัส OTP ต้องเป็นตัวเลข 6 หลัก",
                },
              ]}
            >
              <Input
                prefix={<NumberOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="รหัส OTP 6 หลัก"
                size="large"
                maxLength={6}
              />
            </Form.Item>

            <Form.Item
              label="รหัสผ่านใหม่"
              name="newPassword"
              rules={[
                { required: true, message: "กรุณากรอกรหัสผ่านใหม่" },
                { min: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="รหัสผ่านใหม่"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="ยืนยันรหัสผ่านใหม่"
              name="confirmPassword"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                { required: true, message: "กรุณายืนยันรหัสผ่านใหม่" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="ยืนยันรหัสผ่านใหม่"
                size="large"
              />
            </Form.Item>

            <div style={{ marginBottom: 16, textAlign: "center" }}>
              <Button
                type="link"
                onClick={handleResendOTP}
                disabled={countdown > 0}
              >
                ส่งรหัส OTP อีกครั้ง {countdown > 0 ? `(${countdown}s)` : ""}
              </Button>
            </div>

            <Form.Item>
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  onClick={handleGoBack}
                  size="large"
                  style={{ flex: 1, height: 45 }}
                >
                  ย้อนกลับ
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  style={{ flex: 2, height: 45 }}
                >
                  {loading ? <Spin /> : "ตั้งรหัสผ่านใหม่"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100dvh",
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
          alignItems: "center",
          padding: "20px",
          flex: 1,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 450,
            borderRadius: 12,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            margin: "20px 0",
          }}
          styles={{ body: { padding: "30px" } }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2}>ลืมรหัสผ่าน</Title>
            <Text type="secondary">
              กรอกข้อมูลเพื่อตั้งรหัสผ่านใหม่ผ่านการยืนยัน OTP ทางอีเมล
            </Text>
          </div>

          <Steps
            current={currentStep}
            style={{ marginBottom: 30 }}
            items={[
              {
                title: "ขอรหัส OTP",
                description: "กรอกอีเมล",
              },
              {
                title: "ตั้งรหัสผ่านใหม่",
                description: "ยืนยัน OTP",
              },
            ]}
          />

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
              closable
              onClose={() => setError("")}
            />
          )}

          {renderStepContent()}

          <Divider style={{ margin: "24px 0" }}>
            <Text type="secondary">หรือ</Text>
          </Divider>

          <div style={{ textAlign: "center" }}>
            <Link to="/login" style={{ fontWeight: "bold" }}>
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default ForgotPassword;
