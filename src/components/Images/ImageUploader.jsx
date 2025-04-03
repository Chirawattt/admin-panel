import React from "react";
import { Upload, Spin, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

/**
 * Component สำหรับอัปโหลดรูปภาพ
 */
const ImageUploader = ({ onUpload, isDisabled, isUploading }) => {
  const handleUpload = ({ file }) => {
    if (isDisabled) {
      message.warning("กรุณาเลือกชุดก่อนอัปโหลดรูป");
      return;
    }

    // Check file type
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น");
      return Upload.LIST_IGNORE;
    }

    // Check file size (max 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return Upload.LIST_IGNORE;
    }

    // Call the parent upload handler
    onUpload({ file });
    return true;
  };

  return (
    <Dragger
      customRequest={handleUpload}
      showUploadList={false}
      accept="image/*"
      disabled={isDisabled || isUploading}
      style={{ marginBottom: 20 }}
      multiple={true}
    >
      <p className="ant-upload-drag-icon">
        {isUploading ? <Spin /> : <InboxOutlined />}
      </p>
      <p className="ant-upload-text">คลิกหรือวางไฟล์เพื่ออัปโหลดรูปภาพรีวิว</p>
      <p className="ant-upload-hint" style={{ color: "#888" }}>
        รองรับไฟล์ .jpg, .jpeg, .png ขนาดไม่เกิน 5MB
      </p>
    </Dragger>
  );
};

export default ImageUploader;
