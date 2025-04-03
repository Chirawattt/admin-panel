import React from "react";
import { Button, Tooltip, Space, Grid } from "antd";
import { SyncOutlined, ReloadOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงปุ่มรีเฟรชและรีเซ็ตสถานะ
 */
const StatusHeaderButtons = ({ onRefresh, onResetAll, loading }) => {
  const screens = useBreakpoint();

  return (
    <Space>
      <Tooltip title="รีเฟรชข้อมูล">
        <Button icon={<SyncOutlined />} onClick={onRefresh} loading={loading} />
      </Tooltip>
      <Button
        type="primary"
        danger
        icon={<ReloadOutlined />}
        onClick={onResetAll}
      >
        {screens.xs ? "" : "รีเซ็ตทั้งหมดเป็นว่าง"}
      </Button>
    </Space>
  );
};

export default StatusHeaderButtons;
