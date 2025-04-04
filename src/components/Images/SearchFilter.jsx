import React from "react";
import { Collapse, Radio, Typography, Space } from "antd";
import "./SearchFilter.css";
import PropTypes from "prop-types";

const { Title } = Typography;

/**
 * Component สำหรับแสดงตัวกรองการค้นหารูปภาพ
 */
const SearchFilter = ({ sortOrder, onSortChange, onReset }) => {
  // Define items for Collapse
  const collapseItems = [
    {
      key: "1",
      label: "เรียงลำดับรูปภาพ",
      children: (
        <div className="search-filter-content">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={5}>เรียงตามวันที่อัปโหลด</Title>
            <Radio.Group
              onChange={(e) => onSortChange(e.target.value)}
              value={sortOrder}
              style={{ marginBottom: 16 }}
            >
              <Space direction="vertical">
                <Radio value="newest">ล่าสุด - เก่าสุด</Radio>
                <Radio value="oldest">เก่าสุด - ล่าสุด</Radio>
              </Space>
            </Radio.Group>
            <div className="search-filter-reset">
              <a onClick={onReset}>คืนค่าเริ่มต้น</a>
            </div>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div className="search-filter-container">
      <Collapse items={collapseItems} defaultActiveKey={["1"]} ghost />
    </div>
  );
};

SearchFilter.propTypes = {
  sortOrder: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default SearchFilter;
