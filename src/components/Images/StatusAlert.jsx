import React from "react";
import { Alert, Button, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

/**
 * Component สำหรับแสดงแจ้งเตือนสถานะต่างๆ
 */
const StatusAlert = ({
  connectionError,
  onRetry,
  selectedCostumeId,
  selectedCostumeName,
  filteredImagesCount,
}) => {
  if (connectionError) {
    return (
      <Alert
        message="ไม่สามารถเชื่อมต่อได้"
        description={connectionError}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
        action={
          <Button icon={<ReloadOutlined />} onClick={onRetry}>
            ลองใหม่
          </Button>
        }
      />
    );
  }

  if (!selectedCostumeId) {
    return (
      <Alert
        message="โปรดเลือกชุดที่ต้องการจัดการรูปภาพ"
        description="กรุณาเลือกชุดจากรายการด้านล่างเพื่อดูและจัดการรูปภาพรีวิว"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  return (
    <Alert
      message={
        <span>
          กำลังจัดการรูปภาพของชุด <strong>{selectedCostumeName}</strong>{" "}
          <Text type="secondary">({filteredImagesCount} รูป)</Text>
        </span>
      }
      type="success"
      showIcon
    />
  );
};

export default StatusAlert;
