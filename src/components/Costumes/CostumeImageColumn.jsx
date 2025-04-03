import React from "react";
import { Image } from "antd";

/**
 * Component สำหรับแสดงรูปภาพของชุดในตาราง
 */
const CostumeImageColumn = ({ imagePath }) => {
  return imagePath ? (
    <Image
      src={imagePath}
      alt="costume"
      preview={true}
      style={{
        width: 50,
        height: 50,
        objectFit: "cover",
        borderRadius: 5,
        cursor: "pointer",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
      }}
      placeholder={
        <div
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          กำลังโหลด...
        </div>
      }
      loading="lazy"
    />
  ) : (
    "ไม่มีรูปภาพ"
  );
};

export default CostumeImageColumn;
