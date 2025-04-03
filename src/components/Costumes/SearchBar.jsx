import React from "react";
import { Input, Space, Grid } from "antd";

const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงช่องค้นหา
 */
const SearchBar = ({ onSearch }) => {
  const screens = useBreakpoint();

  return (
    <Space
      style={{ marginBottom: 16, width: "100%" }}
      direction={screens.xs ? "vertical" : "horizontal"}
    >
      <Input.Search
        placeholder="ค้นหาชุด..."
        allowClear
        onChange={(e) => onSearch({ searchText: e.target.value })}
        style={{ width: screens.xs ? "100%" : 250 }}
      />
    </Space>
  );
};

export default SearchBar;
