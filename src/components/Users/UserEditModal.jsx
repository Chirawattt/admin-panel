import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Grid } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;
const { useBreakpoint } = Grid;

/**
 * คอมโพเนนท์สำหรับแสดง Modal แก้ไขข้อมูลผู้ใช้งาน
 */
const UserEditModal = ({ visible, onCancel, onUpdate, user, loading }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  // รีเซ็ตฟอร์มเมื่อผู้ใช้เปลี่ยน
  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone: user.phone || "",
        userRole: user.userRole,
      });
    }
  }, [visible, user, form]);

  // ส่งข้อมูลฟอร์ม
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onUpdate(user.id, values);
    });
  };

  return (
    <Modal
      title="แก้ไขข้อมูลผู้ใช้"
      open={visible}
      onCancel={onCancel}
      width={screens.xs ? "95%" : 520}
      centered
      styles={{
        body: {
          padding: screens.xs ? "16px 12px" : "24px",
          maxHeight: screens.xs ? "calc(100vh - 200px)" : "none",
          overflowY: "auto",
        },
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          ยกเลิก
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          บันทึก
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        size={screens.xs ? "middle" : "large"}
      >
        <Form.Item
          name="username"
          label="ชื่อผู้ใช้"
          rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
        >
          <Input placeholder="กรอกชื่อผู้ใช้" />
        </Form.Item>

        <Form.Item
          name="email"
          label="อีเมล"
          rules={[
            { required: true, message: "กรุณากรอกอีเมล" },
            { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง" },
          ]}
        >
          <Input placeholder="กรอกอีเมล" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="เบอร์มือถือ"
          rules={[
            {
              pattern: /^[0-9]{9,10}$/,
              message: "เบอร์มือถือต้องเป็นตัวเลข 9-10 หลัก",
            },
          ]}
        >
          <Input
            placeholder="กรอกเบอร์มือถือ"
            maxLength={10}
            addonBefore={screens.xs ? null : "+66"}
          />
        </Form.Item>

        <Form.Item
          name="userRole"
          label="สิทธิ์ผู้ใช้"
          rules={[{ required: true, message: "กรุณาเลือกสิทธิ์ผู้ใช้" }]}
        >
          <Select placeholder="เลือกสิทธิ์ผู้ใช้">
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

UserEditModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  user: PropTypes.object,
  loading: PropTypes.bool,
};

export default UserEditModal;
