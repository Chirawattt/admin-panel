// components/CostumeFormModal.jsx
import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const CostumeFormModal = ({
  open,
  onClose,
  onSubmit,
  form,
  isLoading,
  costumeState,
  handleImageChange,
  handleFormChange,
}) => {
  useEffect(() => {
    if (!open) form.resetFields();
  }, [form, open]);

  return (
    <Modal
      title={costumeState.editCostume ? "แก้ไขชุด" : "เพิ่มชุดใหม่"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okButtonProps={{
        disabled: !costumeState.isChange,
        loading: isLoading,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        onValuesChange={handleFormChange}
      >
        <Form.Item label="อัปโหลดรูปภาพ">
          <Upload
            beforeUpload={() => false}
            onChange={handleImageChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
          </Upload>
          {!costumeState.editCostume && (
            <p style={{ color: "red" }}>
              * โปรดอัปโหลดรูปภาพชุดทุกครั้งในการเพิ่มชุด
            </p>
          )}
          {(costumeState.selectedImage ||
            costumeState.editCostume?.image_name) && (
            <p style={{ marginTop: 10 }}>
              ไฟล์ที่เลือก:{" "}
              {costumeState.selectedImage?.name ||
                costumeState.editCostume?.image_name}
            </p>
          )}
          {costumeState.previewImage && (
            <img
              src={costumeState.previewImage}
              alt="preview"
              style={{ width: "100%", borderRadius: 8, marginTop: 10 }}
            />
          )}
        </Form.Item>

        <Form.Item
          label="ชื่อชุด"
          name="name"
          rules={[{ required: true, message: "โปรดกรอกชื่อชุด" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="ราคาเช่า"
          name="price"
          rules={[{ required: true, message: "โปรดกรอกราคาเช่า" }]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item
          label="ประเภทชุด"
          name="category"
          rules={[{ required: true, message: "โปรดเลือกประเภทชุด" }]}
        >
          <Select>
            <Option value="0">กิโมโน</Option>
            <Option value="1">ยูกาตะ</Option>
            <Option value="2">คอสเพลย์</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="กลุ่มอายุ"
          name="age_group"
          rules={[{ required: true, message: "โปรดเลือกกลุ่มอายุ" }]}
        >
          <Select>
            <Option value="child">เด็ก</Option>
            <Option value="adult">ผู้ใหญ่</Option>
            <Option value="both">เด็กและผู้ใหญ่</Option>
          </Select>
        </Form.Item>
      </Form>
      {costumeState.editCostume && (
        <div style={{ marginTop: 20, fontSize: 12, color: "#888" }}>
          <p>
            <b>สร้างเมื่อ:</b>{" "}
            {dayjs(costumeState.editCostume.createdAt).format(
              "D MMMM YYYY เวลา HH:mm น."
            )}
          </p>
          <p>
            <b>อัปเดตล่าสุด:</b>{" "}
            {dayjs(costumeState.editCostume.updatedAt).fromNow()} (
            {dayjs(costumeState.editCostume.updatedAt).format(
              "D MMMM YYYY เวลา HH:mm น."
            )}
            )
          </p>
        </div>
      )}
    </Modal>
  );
};

export default CostumeFormModal;
