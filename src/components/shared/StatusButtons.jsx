import React from "react";
import { Button, Badge, Row, Col, Grid } from "antd";

const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงปุ่มสถานะชุด
 */
const StatusButtons = ({
  statusCounts,
  filterState,
  onFilterChange,
  loading,
}) => {
  const screens = useBreakpoint();

  return (
    <Row gutter={[8, 8]} style={{ width: screens.xs ? "100%" : "auto" }}>
      <Col span={screens.xs ? 12 : 24}>
        <Badge
          count={statusCounts.available}
          showZero
          color="green"
          style={{ marginRight: 8 }}
        >
          <Button
            type={filterState.statusFilter === "1" ? "primary" : "default"}
            onClick={() =>
              onFilterChange({
                statusFilter: filterState.statusFilter === "1" ? "all" : "1",
              })
            }
            style={{
              width: screens.xs ? "100%" : "auto",
              ...(filterState.statusFilter === "1"
                ? { backgroundColor: "#52c41a", borderColor: "#52c41a" }
                : {}),
            }}
            loading={loading}
          >
            ว่าง
          </Button>
        </Badge>
      </Col>
      <Col span={screens.xs ? 12 : 24}>
        <Badge count={statusCounts.unavailable} showZero color="red">
          <Button
            type={filterState.statusFilter === "0" ? "primary" : "default"}
            danger={filterState.statusFilter === "0"}
            onClick={() =>
              onFilterChange({
                statusFilter: filterState.statusFilter === "0" ? "all" : "0",
              })
            }
            style={{ width: screens.xs ? "100%" : "auto" }}
            loading={loading}
          >
            ติดคิว
          </Button>
        </Badge>
      </Col>
    </Row>
  );
};

export default StatusButtons;
