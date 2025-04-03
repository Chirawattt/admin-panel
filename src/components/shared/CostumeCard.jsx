import React from "react";
import { Typography, Tooltip, Tag } from "antd";
import "./CostumeCard.css";

const { Text } = Typography;

/**
 * Component สำหรับแสดงการ์ดชุด
 */
const CostumeCard = ({
  costume,
  isSelected,
  onClick,
  isHighlighted = false,
  renderStatus = false,
  showAgeAndCategory = true,
}) => {
  const isAvailable = renderStatus ? costume.status === 1 : true;

  const getStatusTag = (status) => {
    return status === 1 ? (
      <Tag color="green">ว่าง</Tag>
    ) : (
      <Tag color="red">ติดคิว</Tag>
    );
  };

  const getCategoryDisplay = (category) => {
    const categoryMap = { 0: "กิโมโน", 1: "ยูกาตะ", 2: "คอสเพลย์" };
    return categoryMap[category] || "ไม่ระบุ";
  };

  const getAgeGroupDisplay = (ageGroup) => {
    const ageGroupMap = {
      children: "เด็ก",
      adult: "ผู้ใหญ่",
      both: "เด็กและผู้ใหญ่",
    };
    return ageGroupMap[ageGroup] || "ไม่ระบุ";
  };

  // Build className based on props
  const cardClassName = `costume-card ${isSelected ? "selected" : ""} ${
    isHighlighted ? "highlighted" : ""
  } ${renderStatus ? (isAvailable ? "available" : "unavailable") : ""}`;

  return (
    <div
      className={cardClassName}
      onClick={onClick}
      style={{
        transform: isSelected || isHighlighted ? "scale(1.02)" : "scale(1)",
      }}
    >
      {renderStatus && (
        <div className="costume-card-status">
          {getStatusTag(costume.status)}
        </div>
      )}

      <div className="costume-card-image-container">
        <img
          src={costume.image_path}
          alt={costume.name}
          className="costume-card-image"
          loading="lazy"
        />
      </div>
      <div className="costume-card-content">
        <Tooltip title={costume.name}>
          <Text className="costume-card-title">{costume.name}</Text>
        </Tooltip>

        {showAgeAndCategory && (
          <Text type="secondary" className="costume-card-subtitle">
            {getCategoryDisplay(costume.category)}
            {costume.age_group && ` - ${getAgeGroupDisplay(costume.age_group)}`}
          </Text>
        )}
      </div>
    </div>
  );
};

export default CostumeCard;
