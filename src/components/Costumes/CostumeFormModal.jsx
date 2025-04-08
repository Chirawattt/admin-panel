// components/CostumeFormModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Typography,
  InputNumber,
  Image,
  Space,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import {
  formatThaiRelativeTime,
  formatFullThaiDate,
} from "../../utils/dateUtils";

const { Option } = Select;
const { Dragger } = Upload;
const { Text } = Typography;

// ImagePreview component for displaying uploaded images
const ImagePreview = ({ image, previewImage }) => {
  const [visible, setVisible] = useState(false);

  if (!image && !previewImage) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          cursor: "pointer",
          maxWidth: "100%",
        }}
        onClick={() => setVisible(true)}
      >
        <img
          src={previewImage}
          alt="preview"
          style={{
            width: "100%",
            borderRadius: 8,
            objectFit: "contain",
            maxHeight: "200px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(0,0,0,0.5)",
            color: "white",
            borderRadius: 4,
            padding: "2px 8px",
            fontSize: 12,
          }}
        >
          <ZoomInOutlined /> คลิกเพื่อขยาย
        </div>
      </div>
      <Image
        width={0}
        style={{ display: "none" }}
        src={previewImage}
        preview={{
          visible,
          onVisibleChange: (vis) => setVisible(vis),
          mask: null,
        }}
      />
    </div>
  );
};

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

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Custom price validator
  const validatePrice = (_, value) => {
    if (value < 0) {
      return Promise.reject(new Error("ราคาต้องไม่ติดลบ"));
    }
    return Promise.resolve();
  };

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
      width={window.innerWidth < 768 ? "95%" : 520}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        onValuesChange={handleFormChange}
        requiredMark="optional"
      >
        <Form.Item
          label="รูปภาพชุด"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: !costumeState.editCostume,
              message: "โปรดอัปโหลดรูปภาพชุด",
            },
          ]}
        >
          <Dragger
            name="file"
            multiple={false}
            beforeUpload={() => false}
            onChange={handleImageChange}
            showUploadList={false}
            accept="image/*"
            height={130}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">คลิกหรือลากไฟล์มาวางที่นี่</p>
            <p className="ant-upload-hint">
              รองรับไฟล์ภาพเท่านั้น (JPEG, PNG, GIF)
            </p>
          </Dragger>
        </Form.Item>

        {(costumeState.selectedImage ||
          costumeState.editCostume?.image_name) && (
          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text>
                ไฟล์ที่เลือก:{" "}
                {costumeState.selectedImage?.name ||
                  costumeState.editCostume?.image_name}
              </Text>
              <ImagePreview
                image={
                  costumeState.selectedImage ||
                  costumeState.editCostume?.image_name
                }
                previewImage={costumeState.previewImage}
              />
            </Space>
          </Form.Item>
        )}

        <Form.Item
          label="ชื่อชุด"
          name="name"
          rules={[{ required: true, message: "โปรดกรอกชื่อชุด" }]}
        >
          <Input placeholder="ระบุชื่อชุด" maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          label="ราคาเช่า (บาท)"
          name="price"
          rules={[
            { required: true, message: "โปรดกรอกราคาเช่า" },
            { validator: validatePrice },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            precision={0}
            placeholder="ระบุราคาเช่า"
            addonAfter="บาท"
          />
        </Form.Item>

        <Form.Item
          label="ประเภทชุด"
          name="category"
          rules={[{ required: true, message: "โปรดเลือกประเภทชุด" }]}
        >
          <Select placeholder="เลือกประเภทชุด">
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
          <Select placeholder="เลือกกลุ่มอายุ">
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
            {formatFullThaiDate(costumeState.editCostume.createdAt)}
          </p>
          <p>
            <b>อัปเดตล่าสุด:</b>{" "}
            {formatThaiRelativeTime(costumeState.editCostume.updatedAt)} (
            {formatFullThaiDate(costumeState.editCostume.updatedAt)})
          </p>
        </div>
      )}
    </Modal>
  );
};

export default CostumeFormModal;
