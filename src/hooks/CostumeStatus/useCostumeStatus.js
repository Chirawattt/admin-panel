import { useState, useEffect, useMemo } from "react";
import { message, Modal } from "antd";
import {
  FetchRentableCostumes,
  UpdateCostumeStatus,
  ResetAllCostumeStatusToAvailable,
} from "../../api/costumeApi";

/**
 * Custom hook สำหรับจัดการสถานะชุด
 */
const useCostumeStatus = () => {
  const [costumes, setCostumes] = useState([]);
  const [filterState, setFilterState] = useState({
    search: "",
    categoryFilter: null,
    statusFilter: "all",
    ageGroupFilter: null,
  });

  const [selectedCostume, setSelectedCostume] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // คำนวณจำนวนชุดแยกตามสถานะ
  const statusCounts = useMemo(() => {
    return {
      all: costumes?.length || 0,
      available:
        costumes?.filter((costume) => costume.status === 1).length || 0,
      unavailable:
        costumes?.filter((costume) => costume.status === 0).length || 0,
    };
  }, [costumes]);

  const fetchCostumes = async () => {
    setLoading(true);
    try {
      const data = await FetchRentableCostumes();
      setCostumes(data);
    } catch (err) {
      console.error("Error fetching costumes:", err);
      message.error("ไม่สามารถโหลดข้อมูลชุดได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostumes();
  }, []);

  const filterCostumes = useMemo(
    () =>
      costumes?.filter(
        (costume) =>
          costume.name
            .toLowerCase()
            .includes(filterState.search.toLowerCase()) &&
          (filterState.categoryFilter
            ? costume.category.toString() === filterState.categoryFilter
            : true) &&
          (filterState.statusFilter !== "all"
            ? costume.status.toString() === filterState.statusFilter
            : true) &&
          (filterState.ageGroupFilter
            ? costume.age_group === filterState.ageGroupFilter
            : true)
      ) || [],
    [
      costumes,
      filterState.search,
      filterState.categoryFilter,
      filterState.statusFilter,
      filterState.ageGroupFilter,
    ]
  );

  const handleFilterChange = (newFilters) => {
    setFilterState({
      ...filterState,
      ...newFilters,
    });
  };

  const handleStatusToggle = async () => {
    if (!selectedCostume) return;

    const newStatus = selectedCostume.status === 1 ? 0 : 1;
    try {
      await UpdateCostumeStatus(selectedCostume.id, newStatus);
      message.success("เปลี่ยนสถานะสำเร็จ");
      setDetailVisible(false);
      setHighlightedId(selectedCostume.id); // ตั้งค่า ID ที่ถูกคลิก
      fetchCostumes();

      // ลบ ID ที่ถูกคลิกหลังจาก 2 วินาที
      setTimeout(() => setHighlightedId(null), 800);
    } catch (err) {
      console.error("Error updating status:", err);
      message.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    }
  };

  const resetAllStatusToAvailable = () => {
    Modal.confirm({
      title: "ยืนยันการรีเซ็ตสถานะทั้งหมด?",
      content: "คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตสถานะชุดทั้งหมดให้เป็น 'ว่าง'?",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        setLoading(true);
        try {
          await ResetAllCostumeStatusToAvailable();
          message.success("รีเซ็ตสถานะชุดทั้งหมดเรียบร้อยแล้ว");
          fetchCostumes(); // โหลดข้อมูลใหม่
        } catch (err) {
          console.error("Error resetting statuses:", err);
          message.error("เกิดข้อผิดพลาดในการรีเซ็ตสถานะ");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const showCostumeDetail = (costume) => {
    setSelectedCostume(costume);
    setDetailVisible(true);
  };

  return {
    costumes,
    filterCostumes,
    statusCounts,
    filterState,
    selectedCostume,
    detailVisible,
    highlightedId,
    loading,
    fetchCostumes,
    handleFilterChange,
    handleStatusToggle,
    resetAllStatusToAvailable,
    showCostumeDetail,
    setDetailVisible,
  };
};

export default useCostumeStatus;
