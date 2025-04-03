import React from "react";
import { Row, Col, Typography, Space, Button, Tooltip, Grid } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงส่วนหัวของหน้า
 */
const PageHeader = ({ title, onRefresh, loading, onAddNew }) => {
  const screens = useBreakpoint();

  return (
    <Row
      justify="space-between"
      align="middle"
      style={{ marginBottom: 16 }}
      wrap={true}
    >
      <Col xs={24} sm={12}>
        <Title level={screens.xs ? 4 : 3}>{title}</Title>
      </Col>
      <Col
        xs={24}
        sm={12}
        style={{
          textAlign: screens.xs ? "left" : "right",
          marginTop: screens.xs ? 10 : 0,
        }}
      >
        <Space>
          <Tooltip title="รีเฟรชข้อมูล">
            <Button
              icon={<SyncOutlined />}
              onClick={onRefresh}
              loading={loading}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Button type="primary" onClick={onAddNew}>
            เพิ่มชุดใหม่
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default PageHeader;
