import { useState, useEffect, useCallback, useMemo } from "react";
import { message } from "antd";
import { getAllUsers, updateUser, deleteUser } from "../../api/authApi";

/**
 * Custom hook สำหรับการจัดการผู้ใช้งาน (สำหรับ Admin)
 */
const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("username");
  const [sortOrder, setSortOrder] = useState("ascend");

  // ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      // เพิ่มวิธีการแปลงข้อมูลวันที่ให้ถูกต้อง
      const formattedData = data.map((user) => ({
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
      }));
      setUsers(formattedData);
      setError(null);
    } catch (error) {
      setError("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ดึงข้อมูลผู้ใช้เมื่อ component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ฟังก์ชันสำหรับแก้ไขผู้ใช้
  const handleUpdateUser = async (userId, userData) => {
    setLoading(true);
    try {
      await updateUser(userId, userData);
      message.success("อัปเดตผู้ใช้เรียบร้อยแล้ว");
      fetchUsers();
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  // ฟังก์ชันสำหรับลบผู้ใช้
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await deleteUser(userId);
      message.success("ลบผู้ใช้เรียบร้อยแล้ว");
      fetchUsers();
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเปิด modal แก้ไขผู้ใช้
  const showEditModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // ฟังก์ชันปิด modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // ฟังก์ชันตั้งค่าการค้นหา
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // ฟังก์ชันตั้งค่าการเรียงลำดับ
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order || "ascend");
    }
  };

  // กรองและเรียงลำดับข้อมูลผู้ใช้
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // กรองตามคำค้นหา
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          (user.phone && user.phone.includes(query))
      );
    }

    // เรียงลำดับข้อมูล
    if (sortField && sortOrder) {
      result.sort((a, b) => {
        let compareA = a[sortField];
        let compareB = b[sortField];

        // จัดการการเรียงลำดับประเภทข้อมูลพิเศษ
        if (sortField === "createdAt") {
          compareA = new Date(a.createdAt);
          compareB = new Date(b.createdAt);
        }

        if (sortOrder === "ascend") {
          if (typeof compareA === "string") {
            return compareA.localeCompare(compareB);
          }
          return compareA - compareB;
        } else {
          if (typeof compareA === "string") {
            return compareB.localeCompare(compareA);
          }
          return compareB - compareA;
        }
      });
    }

    return result;
  }, [users, searchQuery, sortField, sortOrder]);

  return {
    users: filteredAndSortedUsers,
    loading,
    error,
    selectedUser,
    isModalVisible,
    fetchUsers,
    handleUpdateUser,
    handleDeleteUser,
    showEditModal,
    handleCancel,
    handleSearch,
    handleTableChange,
  };
};

export default useUserManagement;
