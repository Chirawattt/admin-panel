import React from "react";
import { Collapse, Select, Typography, Row, Col, Grid } from "antd";
import PropTypes from "prop-types";

const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงตัวกรองการค้นหาขั้นสูง
 */
const AdvancedSearchFilter = ({ onFilterChange }) => {
  const screens = useBreakpoint();

  const handleChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  // Define items for Collapse
  const collapseItems = [
    {
      key: "1",
      label: "ค้นหาขั้นสูง",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Title level={5}>ประเภทชุด</Title>
            <Select
              style={{ width: "100%" }}
              placeholder="เลือกประเภทชุด"
              onChange={(value) => handleChange("category", value)}
              allowClear
            >
              <Option value="กิโมโน">กิโมโน</Option>
              <Option value="ยูกาตะ">ยูกาตะ</Option>
              <Option value="คอสเพลย์">คอสเพลย์</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Title level={5}>สถานะการให้เช่า</Title>
            <Select
              style={{ width: "100%" }}
              placeholder="เลือกสถานะ"
              onChange={(value) => handleChange("rentalStatus", value)}
              allowClear
            >
              <Option value="available">พร้อมให้เช่า</Option>
              <Option value="rented">กำลังถูกเช่า</Option>
              <Option value="maintenance">อยู่ระหว่างซ่อมแซม</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Title level={5}>ช่วงอายุ</Title>
            <Select
              style={{ width: "100%" }}
              placeholder="เลือกช่วงอายุ"
              onChange={(value) => handleChange("ageGroup", value)}
              allowClear
            >
              <Option value="children">เด็ก</Option>
              <Option value="adult">ผู้ใหญ่</Option>
            </Select>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Collapse
      items={collapseItems}
      ghost
      style={{ marginBottom: screens.xs ? 16 : 24 }}
    />
  );
};

AdvancedSearchFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default AdvancedSearchFilter;
