import React from "react";
import { Modal, Button, Row, Col, Typography, Tag, Grid } from "antd";
import dayjs from "dayjs";

const { Text } = Typography;
const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงรายละเอียดชุด
 */
const CostumeDetail = ({
  costume,
  visible,
  onCancel,
  onToggleStatus,
  getStatusTag,
  getCategoryDisplay,
  getAgeGroupDisplay,
}) => {
  const screens = useBreakpoint();

  if (!costume) return null;

  return (
    <Modal
      title={costume.name}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          ยกเลิก
        </Button>,
        <Button
          key="status"
          type={costume.status === 0 ? "primary" : "primary"}
          danger={costume.status === 1} // ถ้าจะเปลี่ยนเป็นติดคิว → danger
          style={{
            backgroundColor: costume.status === 0 ? "#52c41a" : undefined, // ถ้าจะเปลี่ยนเป็นว่าง → เขียว
            borderColor: costume.status === 0 ? "#52c41a" : undefined,
          }}
          onClick={onToggleStatus}
        >
          เปลี่ยนสถานะเป็น {costume.status === 1 ? "ติดคิว" : "ว่าง"}
        </Button>,
      ]}
      width={screens.xs ? "95%" : 520}
      style={{ maxWidth: "100%" }}
      centered
    >
      {/* รูปภาพขนาดกลาง ไม่เต็ม modal */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <img
          src={costume.image_path}
          alt={costume.name}
          style={{
            maxWidth: "100%",
            maxHeight: screens.xs ? 250 : 300,
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
      </div>

      {/* แสดงรายละเอียดชุด */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <Typography.Text strong>สถานะปัจจุบัน: </Typography.Text>
            {getStatusTag(costume.status)}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <Typography.Text strong>ชื่อ:</Typography.Text>
          <div>{costume.name}</div>
        </Col>
        <Col xs={24} sm={12}>
          <Typography.Text strong>หมวดหมู่:</Typography.Text>
          <div>{getCategoryDisplay(costume.category)}</div>
        </Col>
        {costume.age_group && (
          <Col xs={24} sm={12}>
            <Typography.Text strong>กลุ่มอายุ:</Typography.Text>
            <div>{getAgeGroupDisplay(costume.age_group)}</div>
          </Col>
        )}
        <Col xs={24}>
          <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
            <div>อัปเดตสถานะล่าสุด: {dayjs(costume.updatedAt).fromNow()}</div>
            <div>
              {dayjs(costume.updatedAt).format("D MMMM YYYY เวลา HH:mm น.")}
            </div>
          </Typography.Text>
        </Col>
      </Row>
    </Modal>
  );
};

export default CostumeDetail;
