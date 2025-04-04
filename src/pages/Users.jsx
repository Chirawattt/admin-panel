import React, { useState } from "react";
import {
  Layout,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Popconfirm,
  Tooltip,
  Input,
  Row,
  Col,
  Card,
  Grid,
  Empty,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  UserDeleteOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Navbar from "../components/shared/Navbar";
import useUserManagement from "../hooks/Users/useUserManagement";
import UserEditModal from "../components/Users/UserEditModal";
import "../components/Users/UserManagement.css";

const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

/**
 * หน้าจัดการผู้ใช้งาน (สำหรับ Admin เท่านั้น)
 */
const Users = () => {
  const screens = useBreakpoint();
  const [searchText, setSearchText] = useState("");

  const {
    users,
    loading,
    selectedUser,
    isModalVisible,
    fetchUsers,
    handleUpdateUser,
    handleDeleteUser,
    showEditModal,
    handleCancel,
    handleSearch,
    handleTableChange,
  } = useUserManagement();

  // จัดการการค้นหา
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    handleSearch(value);
  };

  // ตั้งค่าคอลัมน์ของตาราง
  const getColumns = () => {
    // คอลัมน์พื้นฐานที่แสดงในทุกขนาดหน้าจอ
    const baseColumns = [
      {
        title: "ชื่อผู้ใช้",
        dataIndex: "username",
        key: "username",
        sorter: true,
        render: (text, record) => (
          <div>
            <div style={{ fontWeight: "500" }}>{text}</div>
            {screens.xs && (
              <div className="user-contact-info">
                {record.email && (
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    <MailOutlined style={{ marginRight: "4px" }} />
                    {record.email}
                  </div>
                )}
                {record.phone && (
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    <PhoneOutlined style={{ marginRight: "4px" }} />
                    {record.phone}
                  </div>
                )}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "สิทธิ์",
        dataIndex: "userRole",
        key: "userRole",
        render: (userRole) => (
          <Tag
            color={userRole === "admin" ? "red" : "blue"}
            className={`role-tag ${
              userRole === "admin" ? "admin-role-tag" : "user-role-tag"
            }`}
          >
            {userRole === "admin" ? "Admin" : "User"}
          </Tag>
        ),
        filters: [
          { text: "Admin", value: "admin" },
          { text: "User", value: "user" },
        ],
        onFilter: (value, record) => record.userRole === value,
        width: screens.xs ? 80 : undefined,
      },
      {
        title: "จัดการ",
        key: "action",
        width: screens.xs ? 100 : 150,
        render: (_, record) => (
          <Space size="small" className="user-action-buttons">
            <Tooltip title="แก้ไข">
              <Button
                icon={<EditOutlined />}
                onClick={() => showEditModal(record)}
                type="primary"
                size="small"
              />
            </Tooltip>
            <Tooltip title="ลบ">
              <Popconfirm
                title="คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?"
                onConfirm={() => handleDeleteUser(record.id)}
                okText="ใช่"
                cancelText="ไม่"
              >
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  disabled={record.userRole === "admin"} // ป้องกันการลบ admin
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];

    // คอลัมน์ที่แสดงเฉพาะหน้าจอขนาดใหญ่
    if (!screens.xs) {
      return [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          width: 80,
        },
        ...baseColumns.slice(0, 1),
        {
          title: "อีเมล",
          dataIndex: "email",
          key: "email",
          sorter: true,
          render: (email) => (
            <span>
              <MailOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
              {email || "-"}
            </span>
          ),
        },
        {
          title: "เบอร์มือถือ",
          dataIndex: "phone",
          key: "phone",
          render: (phone) => (
            <span className="user-phone">
              <PhoneOutlined className="user-phone-icon" />
              {phone || "-"}
            </span>
          ),
        },
        ...baseColumns.slice(1),
        {
          title: "วันที่สร้าง",
          dataIndex: "createdAt",
          key: "createdAt",
          render: (date) => new Date(date).toLocaleDateString("th-TH"),
          sorter: true,
          responsive: ["md"],
        },
      ];
    }

    return baseColumns;
  };

  // แสดงเมื่อไม่มีข้อมูลผู้ใช้
  const renderEmptyContent = () => {
    // กรณีกำลังค้นหาแต่ไม่พบข้อมูล
    if (searchText) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="user-table-empty">
              <SearchOutlined style={{ fontSize: 40, color: "#d9d9d9" }} />
              <p>ไม่พบข้อมูลที่ตรงกับคำค้นหา "{searchText}"</p>
              <Button
                type="link"
                onClick={() => {
                  setSearchText("");
                  handleSearch("");
                }}
              >
                ล้างการค้นหา
              </Button>
            </div>
          }
        />
      );
    }

    // กรณีไม่มีข้อมูลผู้ใช้เลย
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="user-table-empty">
            <UserDeleteOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
            <p>ไม่พบข้อมูลผู้ใช้</p>
          </div>
        }
      />
    );
  };

  return (
    <Layout>
      <Navbar />
      <Layout style={{ background: "#f5f7fa", minHeight: "100vh" }}>
        <Content
          className="user-management-container"
          style={{
            margin: "20px auto",
            width: "100%",
            maxWidth: 1200,
            padding: screens.xs ? 12 : 24,
          }}
        >
          <Card
            bodyStyle={{ padding: screens.xs ? 12 : 24 }}
            className="user-management-card"
          >
            <Row
              gutter={[16, 16]}
              align="middle"
              className="user-management-header"
              wrap={screens.sm ? false : true}
            >
              <Col flex={screens.sm ? "auto" : "100%"}>
                <Title
                  level={screens.xs ? 5 : 4}
                  className="user-management-title"
                >
                  <UserOutlined /> จัดการบัญชีผู้ใช้
                </Title>
              </Col>
              <Col flex={screens.sm ? "none" : "100%"}>
                <Space
                  style={{
                    width: screens.sm ? "auto" : "100%",
                    justifyContent: screens.sm ? "flex-start" : "space-between",
                  }}
                >
                  <Input
                    placeholder="ค้นหาผู้ใช้ หรือ เบอร์มือถือ"
                    prefix={<SearchOutlined />}
                    style={{ width: screens.sm ? 220 : "calc(100% - 40px)" }}
                    allowClear
                    value={searchText}
                    onChange={onSearchChange}
                    className="user-search-input"
                  />
                  <Tooltip title="รีเฟรช">
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={fetchUsers}
                      loading={loading}
                    />
                  </Tooltip>
                </Space>
              </Col>
            </Row>

            <Table
              columns={getColumns()}
              dataSource={users}
              rowKey="id"
              loading={loading}
              locale={{ emptyText: renderEmptyContent() }}
              pagination={{
                pageSize: screens.xs ? 5 : 10,
                showSizeChanger: !screens.xs,
                showTotal: screens.xs
                  ? undefined
                  : (total) => `ทั้งหมด ${total} รายการ`,
                size: screens.xs ? "small" : "default",
              }}
              scroll={{ x: "max-content" }}
              size={screens.xs ? "small" : "middle"}
              className="user-table"
              rowClassName={() => "user-table-row"}
              onChange={handleTableChange}
            />

            {users.length > 0 && !loading && (
              <div style={{ marginTop: 16, textAlign: "right" }}>
                <Text type="secondary">
                  {`จำนวนผู้ใช้ทั้งหมด: ${users.length} คน (Admin: ${
                    users.filter((u) => u.userRole === "admin").length
                  }, User: ${
                    users.filter((u) => u.userRole !== "admin").length
                  })`}
                </Text>
              </div>
            )}
          </Card>

          {/* โมดัลแก้ไขผู้ใช้ */}
          {selectedUser && (
            <UserEditModal
              visible={isModalVisible}
              onCancel={handleCancel}
              onUpdate={handleUpdateUser}
              user={selectedUser}
              loading={loading}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Users;
