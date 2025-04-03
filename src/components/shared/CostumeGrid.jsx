import React from "react";
import { Row, Col, Skeleton, Empty, Grid } from "antd";
import CostumeCard from "./CostumeCard";

const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงกริดของชุด
 */
const CostumeGrid = ({
  costumes,
  selectedCostumeId,
  onSelect,
  loading,
  renderStatus = false,
  highlightedId = null,
  emptyText = "ไม่พบชุดที่ตรงกับเงื่อนไข",
  showAgeAndCategory = true,
}) => {
  const screens = useBreakpoint();

  if (costumes?.length === 0) {
    return (
      <Empty
        description={emptyText}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ margin: "40px 0" }}
      />
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${
            screens.xs ? "140px" : "220px"
          }, 1fr))`,
          gap: screens.xs ? "10px" : "16px",
        }}
      >
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <div key={index} style={{ marginBottom: 16 }}>
              <Skeleton.Image active style={{ width: "100%", height: 180 }} />
              <Skeleton
                active
                paragraph={{ rows: 1 }}
                style={{ marginTop: 8 }}
              />
            </div>
          ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${
          screens.xs ? "140px" : "220px"
        }, 1fr))`,
        gap: screens.xs ? "10px" : "16px",
        marginTop: 24,
      }}
    >
      {costumes.map((costume) => (
        <CostumeCard
          key={costume.id}
          costume={costume}
          isSelected={selectedCostumeId === costume.id}
          isHighlighted={highlightedId === costume.id}
          onClick={() => onSelect(costume)}
          renderStatus={renderStatus}
          showAgeAndCategory={showAgeAndCategory && !screens.xs}
        />
      ))}
    </div>
  );
};

export default CostumeGrid;
