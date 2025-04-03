import React from "react";
import { Typography, Tag } from "antd";

/**
 * Component สำหรับแสดงสรุปผลการค้นหาชุด
 */
const CostumeSummary = ({
  totalCostumes,
  filterState,
  getCategoryDisplay,
  getAgeGroupDisplay,
  getStatusDisplay,
}) => {
  if (totalCostumes <= 0) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <Typography.Text>
        พบชุดทั้งหมด <strong>{totalCostumes}</strong> รายการ
        {filterState.statusFilter !== "all" && (
          <>
            {" "}
            (สถานะ:{" "}
            <Tag color={filterState.statusFilter === "1" ? "green" : "red"}>
              {getStatusDisplay(filterState.statusFilter)}
            </Tag>
            )
          </>
        )}
        {filterState.categoryFilter && (
          <>
            {" "}
            ประเภท:{" "}
            <Tag color="blue">
              {getCategoryDisplay(filterState.categoryFilter)}
            </Tag>
          </>
        )}
        {filterState.ageGroupFilter && (
          <>
            {" "}
            กลุ่มอายุ:{" "}
            <Tag color="purple">
              {getAgeGroupDisplay(filterState.ageGroupFilter)}
            </Tag>
          </>
        )}
      </Typography.Text>
    </div>
  );
};

export default CostumeSummary;
