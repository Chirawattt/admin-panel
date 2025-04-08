import React from "react";
import { Image, Popconfirm, Button, Typography, Tooltip } from "antd";
import { DeleteOutlined, PictureOutlined } from "@ant-design/icons";
import {
  formatThaiRelativeTime,
  formatFullThaiDate,
} from "../../utils/dateUtils";

const { Text } = Typography;

/**
 * Component สำหรับแสดงการ์ดรูปภาพรีวิว
 */
const ImageCard = ({ img, onDelete }) => {
  return (
    <div
      style={{
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        background: "#fff",
        position: "relative",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        },
      }}
    >
      <div
        style={{
          height: 230,
          background: "#f0f0f0",
          position: "relative",
        }}
      >
        {!img.image_path ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              padding: "10px",
              background: "#f5f5f5",
            }}
          >
            <PictureOutlined
              style={{
                fontSize: 32,
                color: "#ccc",
                marginBottom: 8,
              }}
            />
            <Text type="secondary" style={{ textAlign: "center" }}>
              ไม่พบรูปภาพ
            </Text>
          </div>
        ) : (
          <div
            className="image-container"
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <Image
              width="100%"
              height="100%"
              src={img.image_path}
              alt={`รูปรีวิว ${img.id}`}
              preview={{
                mask: (
                  <div style={{ fontSize: 16 }}>คลิกเพื่อดูรูปขนาดใหญ่</div>
                ),
                maskClassName: "custom-mask",
              }}
              style={{
                objectFit: "cover",
                display: "block",
              }}
              placeholder={
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                  }}
                >
                  กำลังโหลด...
                </div>
              }
              fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMTYwdjE2MEgweiIvPjxwYXRoIGQ9Ik04MCAxMDZjMTQuMzYgMCAyNi0xMS42NCAyNi0yNlM5NC4zNiA1NCA4MCA1NCA1NCA2NS42NCA1NCA4MHMxMS42NCAyNiAyNiAyNnptMC04Yy05Ljk0IDAtMTgtOC4wNi0xOC0xOHM4LjA2LTE4IDE4LTE4IDE4IDguMDYgMTggMTgtOC4wNiAxOC0xOCAxOHptNDQgNTF2LTM1bC0yNS0yNWgtMzVMNDAgMTEzbDI2IDI2aDM2bDIyLTIyeiIgZmlsbD0iI0U2RTZFNiIvPjwvZz48L3N2Zz4="
            />
          </div>
        )}
      </div>

      <div style={{ padding: 12 }}>
        <Tooltip title={img.image_path?.split("/").pop() || "ไม่พบชื่อไฟล์"}>
          <Text
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 13,
            }}
          >
            {img.image_path?.split("/").pop() || "ไม่พบชื่อไฟล์"}
          </Text>
        </Tooltip>
        <Text type="secondary" style={{ fontSize: 12 }}>
          อัปโหลดเมื่อ: {formatThaiRelativeTime(img?.createdAt)}
        </Text>
        {img?.createdAt && (
          <>
            <Tooltip title={formatFullThaiDate(img.createdAt)}>
              <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
                เวลา: {formatFullThaiDate(img.createdAt)}
              </Text>
            </Tooltip>
          </>
        )}
      </div>

      <Popconfirm
        title="ยืนยันการลบรูปนี้?"
        okText="ลบ"
        cancelText="ยกเลิก"
        onConfirm={() => onDelete && onDelete(img.id)}
        placement="topRight"
      >
        <Button
          danger
          icon={<DeleteOutlined />}
          size="small"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        />
      </Popconfirm>
    </div>
  );
};

export default ImageCard;
