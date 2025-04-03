import React from "react";
import { Table, Button, Space, Grid } from "antd";
import CostumeImageColumn from "./CostumeImageColumn";

const { useBreakpoint } = Grid;

/**
 * Component สำหรับแสดงตารางรายการชุด
 */
const CostumeTable = ({
  dataSource,
  loading,
  pagination,
  onChange,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const screens = useBreakpoint();

  const getColumns = () => [
    {
      title: "รูปภาพ",
      dataIndex: "image_path",
      key: "image",
      render: (image_path) => <CostumeImageColumn imagePath={image_path} />,
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "ชื่อชุด",
      dataIndex: "name",
      key: "name",
      sorter: true,
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "ประเภทชุด",
      dataIndex: "category",
      key: "category",
      sorter: true,
      render: (category) => {
        const categoryMap = { 0: "กิโมโน", 1: "ยูกาตะ", 2: "คอสเพลย์" };
        return categoryMap[category] || "ไม่ระบุ";
      },
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "กลุ่มอายุ",
      dataIndex: "age_group",
      key: "age_group",
      sorter: true,
      render: (age_group) => {
        const ageGroupMap = {
          children: "เด็ก",
          adult: "ผู้ใหญ่",
          both: "เด็กและผู้ใหญ่",
        };
        return ageGroupMap[age_group] || "ไม่ระบุ";
      },
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "การให้บริการ",
      dataIndex: "isRentable",
      key: "isRentable",
      align: "center",
      sorter: true,
      render: (isRentable, record) => {
        const isActive = Boolean(isRentable);
        const buttonText = screens.xs
          ? isActive
            ? "✓"
            : "✗"
          : isActive
          ? "ให้บริการ"
          : "ไม่ให้บริการ";

        return (
          <Button
            type="primary"
            danger={!isActive}
            style={
              isActive
                ? { backgroundColor: "#52c41a", borderColor: "#52c41a" }
                : {}
            }
            onClick={() => onToggleStatus(record)}
            size={screens.xs ? "small" : "middle"}
          >
            {buttonText}
          </Button>
        );
      },
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "การกระทำ",
      align: "center",
      render: (_, record) => (
        <Space size={screens.xs ? "small" : "middle"} wrap={screens.xs}>
          <Button
            size={screens.xs ? "small" : "middle"}
            onClick={() => onEdit(record)}
          >
            {screens.xs ? "แก้ไข" : "แก้ไข"}
          </Button>
          <Button
            size={screens.xs ? "small" : "middle"}
            danger
            onClick={() => onDelete(record.id)}
          >
            {screens.xs ? "ลบ" : "ลบ"}
          </Button>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  return (
    <Table
      columns={getColumns()}
      dataSource={dataSource}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: screens.sm ? true : false,
        pageSizeOptions: ["5", "10", "20", "50"],
        showQuickJumper: screens.sm ? true : false,
        size: screens.xs ? "small" : "default",
        showTotal: screens.sm
          ? (total, range) =>
              `${range[0]}-${range[1]} จากทั้งหมด ${total} รายการ`
          : undefined,
      }}
      onChange={onChange}
      scroll={{ x: "max-content" }}
      size={screens.sm ? "middle" : "small"}
    />
  );
};

export default CostumeTable;
