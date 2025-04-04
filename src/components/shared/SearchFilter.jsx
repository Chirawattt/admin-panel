import React from "react";
import { Collapse, Space, Typography, Input, Select, Grid } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import StatusButtons from "./StatusButtons";

const { Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงตัวกรองการค้นหารูปภาพ
 */
const SearchFilter = ({
  onChange,
  searchPlaceholder = "ค้นหาชื่อไฟล์",
  showAdvanced = false,
  showStatusButtons = false,
  filterState,
  statusCounts,
  loading,
}) => {
  const screens = useBreakpoint();

  const handleFilterChange = (type, value) => {
    if (onChange) {
      onChange({ [type]: value });
    }
  };

  // สร้าง items สำหรับ Collapse แบบใหม่
  const advancedFilterItems = [
    {
      key: "filters",
      label: "ค้นหาขั้นสูง",
      extra: <FilterOutlined />,
      children: (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text strong>ประเภทชุด</Text>
            <Select
              placeholder="เลือกประเภท"
              allowClear
              onChange={(value) => handleFilterChange("categoryFilter", value)}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value="0">กิโมโน</Option>
              <Option value="1">ยูกาตะ</Option>
              <Option value="2">คอสเพลย์</Option>
            </Select>
          </div>

          <div>
            <Text strong>สถานะ</Text>
            <Select
              placeholder="เลือกสถานะ"
              allowClear
              value={filterState?.statusFilter}
              onChange={(value) => handleFilterChange("statusFilter", value)}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value="all">ทั้งหมด</Option>
              <Option value="1">ว่าง</Option>
              <Option value="0">ติดคิว</Option>
            </Select>
          </div>

          <div>
            <Text strong>กลุ่มอายุ</Text>
            <Select
              placeholder="เลือกกลุ่มอายุ"
              allowClear
              onChange={(value) => handleFilterChange("ageGroupFilter", value)}
              style={{ width: "100%", marginTop: 8 }}
            >
              <Option value="children">เด็ก</Option>
              <Option value="adult">ผู้ใหญ่</Option>
              <Option value="both">เด็กและผู้ใหญ่</Option>
            </Select>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
        direction={screens.xs ? "vertical" : "horizontal"}
      >
        <Input.Search
          placeholder={searchPlaceholder}
          allowClear
          onChange={(e) => handleFilterChange("search", e.target.value)}
          style={{ width: screens.xs ? "100%" : 250 }}
        />

        {showStatusButtons && (
          <StatusButtons
            statusCounts={statusCounts}
            filterState={filterState}
            onFilterChange={onChange}
            loading={loading}
          />
        )}
      </Space>

      {showAdvanced && (
        <Collapse
          items={advancedFilterItems}
          bordered={false}
          style={{ background: "#f9f9f9", marginBottom: 16 }}
        />
      )}
    </>
  );
};

export default SearchFilter;
