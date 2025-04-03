import React from "react";
import { Collapse, Row, Col, Select, Typography, Grid } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงตัวกรองการค้นหาขั้นสูง
 */
const AdvancedSearchFilter = ({ onFilterChange }) => {
  const screens = useBreakpoint();

  return (
    <Collapse
      bordered={false}
      style={{ marginBottom: 16, background: "#f9f9f9" }}
    >
      <Collapse.Panel header="ค้นหาขั้นสูง" key="1" extra={<SearchOutlined />}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={screens.md ? 8 : 12}>
            <Typography.Text strong>ประเภทชุด</Typography.Text>
            <Select
              placeholder="เลือกประเภท"
              allowClear
              onChange={(value) => onFilterChange({ categoryFilter: value })}
              style={{ width: "100%" }}
            >
              <Select.Option value="0">กิโมโน</Select.Option>
              <Select.Option value="1">ยูกาตะ</Select.Option>
              <Select.Option value="2">คอสเพลย์</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={screens.md ? 8 : 12}>
            <Typography.Text strong>สถานะการให้บริการ</Typography.Text>
            <Select
              placeholder="เลือกสถานะ"
              allowClear
              onChange={(value) =>
                onFilterChange({
                  isRentableFilter: value !== undefined ? Number(value) : null,
                })
              }
              style={{ width: "100%" }}
            >
              <Select.Option value={1}>ให้บริการ</Select.Option>
              <Select.Option value={0}>ไม่ให้บริการ</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={screens.md ? 8 : 12}>
            <Typography.Text strong>กลุ่มอายุ</Typography.Text>
            <Select
              placeholder="เลือกกลุ่มอายุ"
              allowClear
              onChange={(value) => onFilterChange({ ageGroupFilter: value })}
              style={{ width: "100%" }}
            >
              <Select.Option value="children">เด็ก</Select.Option>
              <Select.Option value="adult">ผู้ใหญ่</Select.Option>
              <Select.Option value="both">เด็กและผู้ใหญ่</Select.Option>
            </Select>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  );
};

export default AdvancedSearchFilter;
