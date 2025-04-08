import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchCostumes } from "../../api/costumeApi";

/**
 * Custom hook สำหรับจัดการข้อมูลชุด
 */
const useCostumeData = () => {
  const queryClient = useQueryClient();

  // สถานะสำหรับ pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // สถานะสำหรับการจัดเรียง
  const [sorter, setSorter] = useState({
    field: "id",
    order: "ascend",
  });

  // สถานะสำหรับการกรอง
  const [filterState, setFilterState] = useState({
    searchText: "",
    categoryFilter: "",
    isRentableFilter: null,
    ageGroupFilter: "",
  });

  // โหลดข้อมูลทั้งหมดแล้วทำ pagination ที่ client
  const {
    data,
    isLoading,
    refetch: reactQueryRefetch,
  } = useQuery({
    queryKey: ["costumes", sorter, filterState],
    queryFn: async () => {
      const allData = await FetchCostumes();
      const filteredData = allData.filter(
        (costume) =>
          costume.name
            .toLowerCase()
            .includes(filterState.searchText.toLowerCase()) &&
          (filterState.categoryFilter
            ? costume.category.toString() === filterState.categoryFilter
            : true) &&
          (filterState.isRentableFilter !== null
            ? costume.isRentable === (filterState.isRentableFilter === 1)
            : true) &&
          (filterState.ageGroupFilter
            ? costume.age_group === filterState.ageGroupFilter
            : true)
      );
      // จัดเรียงข้อมูล
      const sortedData = [...filteredData].sort((a, b) => {
        const field = sorter.field;
        const aValue = a[field];
        const bValue = b[field];
        const order = sorter.order === "ascend" ? 1 : -1;

        if (typeof aValue === "string") {
          return aValue.localeCompare(bValue) * order;
        }
        return (aValue - bValue) * order;
      });
      return {
        allData: sortedData,
        total: filteredData.length,
      };
    },
    staleTime: 30000, // 30 วินาที
    cacheTime: 300000, // 5 นาที
  });

  // ฟังก์ชัน refetch ที่จะล้างแคชและบังคับโหลดข้อมูลใหม่
  const refetch = async () => {
    // ล้างแคชก่อน
    await queryClient.invalidateQueries(["costumes"]);
    // แล้วโหลดข้อมูลใหม่
    return await reactQueryRefetch();
  };

  // ข้อมูลที่แสดงในหน้าปัจจุบัน
  const paginatedData = useMemo(() => {
    if (!data || !data.allData) return [];
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return data.allData.slice(startIndex, endIndex);
  }, [data, pagination]);

  // อัพเดท pagination เมื่อได้ข้อมูลใหม่
  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
      }));
    }
  }, [data]);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนหน้าและการจัดเรียง
  const handleTableChange = (newPagination, _, newSorter) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });

    if (newSorter && newSorter.field) {
      setSorter({
        field: newSorter.field,
        order: newSorter.order,
      });
    }
  };

  // อัพเดทการค้นหาและรีเฟรชข้อมูล
  const handleFilterChange = (newFilters) => {
    setFilterState({
      ...filterState,
      ...newFilters,
    });

    // รีเซ็ตกลับไปหน้าแรกเมื่อเปลี่ยนตัวกรอง
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  return {
    data,
    paginatedData,
    pagination,
    isLoading,
    refetch,
    filterState,
    handleTableChange,
    handleFilterChange,
    queryClient,
  };
};

export default useCostumeData;
