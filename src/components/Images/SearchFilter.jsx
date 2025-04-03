import React from "react";
import { Collapse, Space, Typography, Radio, Button, Flex } from "antd";
import { SortAscendingOutlined, FilterOutlined } from "@ant-design/icons";
import "./SearchFilter.css";

const { Text } = Typography;

/**
 * Component สำหรับแสดงตัวเรียงลำดับรูปภาพรีวิว
 */
const SearchFilter = ({
  sortOrder,
  setSortOrder,
  resetFilters,
  activeFilters,
}) => {
  // Filter header with active filter count badge
  const filterHeader = (
    <div className="filter-header">
      <FilterOutlined style={{ marginRight: 8 }} />
      <span>เรียงลำดับรูปภาพ</span>
      {activeFilters > 0 && (
        <span className="filter-badge">{activeFilters}</span>
      )}
    </div>
  );

  return (
    <div className="image-search-filter">
      <Collapse
        className="filter-collapse"
        expandIconPosition="end"
        defaultActiveKey={["1"]}
      >
        <Collapse.Panel header={filterHeader} key="1">
          <Space
            direction="vertical"
            className="filter-section"
            style={{ width: "100%" }}
          >
            {/* Date sort options */}
            <div>
              <Text strong className="filter-label">
                <SortAscendingOutlined /> เรียงตามวันที่อัปโหลด
              </Text>
              <div className="sort-options">
                <Radio.Group
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  buttonStyle="solid"
                  optionType="button"
                >
                  <Radio.Button value="newest">ล่าสุด</Radio.Button>
                  <Radio.Button value="oldest">เก่าสุด</Radio.Button>
                </Radio.Group>
              </div>
            </div>

            {/* Reset filters */}
            <Flex justify="flex-end">
              <Button type="link" onClick={resetFilters}>
                คืนค่าเริ่มต้น
              </Button>
            </Flex>
          </Space>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default SearchFilter;
