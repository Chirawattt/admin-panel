import React from "react";
import { Row, Col, Space, Button, Badge, Typography, Divider } from "antd";
import { ReloadOutlined, PictureOutlined } from "@ant-design/icons";
import ImageUploader from "./ImageUploader";

const { Text } = Typography;

/**
 * Component สำหรับส่วนอัปโหลดรูปภาพและแสดงข้อมูลเกี่ยวกับการอัปโหลด
 */
const UploadSection = ({
  onUpload,
  onRefresh,
  isDisabled,
  isUploading,
  isLoading,
  imagesCount,
  uploadedCount,
}) => {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <ImageUploader
            onUpload={onUpload}
            isDisabled={isDisabled}
            isUploading={isUploading}
          />
        </Col>
      </Row>

      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Badge count={imagesCount} showZero>
              <Button
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                disabled={isLoading}
              >
                โหลดรูปภาพใหม่
              </Button>
            </Badge>
          </Space>
        </Col>
        <Col>
          <Text type="secondary">
            {uploadedCount > 0 &&
              `อัปโหลดแล้ว ${uploadedCount} รูปในเซสชั่นนี้`}
          </Text>
        </Col>
      </Row>

      <Divider>
        <Space>
          <PictureOutlined />
          <span>รูปภาพรีวิวทั้งหมด {imagesCount} รูป</span>
        </Space>
      </Divider>
    </>
  );
};

export default UploadSection;
