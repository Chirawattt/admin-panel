import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Layout,
  Typography,
  message,
  Image,
} from "antd";
import { toast } from "react-toastify";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FetchCostumes,
  AddCostume,
  UpdateCostume,
  UpdateCostumeIsRentable,
  DeleteCostume,
} from "../api/costumeApi";
import Navbar from "../components/Navbar"; // Import Navbar component
import CostumeFormModal from "../components/CostumeFormModal";
import useCostumeForm from "../hooks/useCostumeForm"; // Custom hook for costume form

const { Content } = Layout;
const { Title } = Typography;

const Costumes = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["costumes"],
    queryFn: FetchCostumes,
  });

  const [form] = Form.useForm(); // สร้างฟอร์มสำหรับการเพิ่ม/แก้ไขชุด

  const {
    costumeState,
    setCostumeState,
    openModal,
    resetForm,
    handleImageChange,
    handleFormChange,
  } = useCostumeForm(form);

  const [filterState, setFilterState] = useState({
    searchText: "",
    categoryFilter: "",
    isRentableFilter: null,
  });

  // สำหรับการตั้งค่าการแสดงผลในตาราง
  const [pageSize, setPageSize] = useState(10);

  // ฟังก์ชันจัดการการบันทึก (เพิ่ม/แก้ไข)
  const onFinish = async (values) => {
    try {
      //  ถ้าเพิ่มชุดใหม่ ต้องมีรูปภาพ
      if (!costumeState.editCostume && !costumeState.selectedImage) {
        toast.error("โปรดอัปโหลดรูปภาพก่อนเพิ่มชุด");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("age_group", values.age_group);

      if (costumeState.selectedImage) {
        formData.append("image", costumeState.selectedImage);
      }

      if (costumeState.editCostume) {
        // แก้ไข
        await UpdateCostume(costumeState.editCostume.id, formData);
        toast.success("แก้ไขข้อมูลชุดสำเร็จ");
      } else {
        // เพิ่มใหม่
        await AddCostume(formData);
        toast.success("เพิ่มชุดใหม่สำเร็จ");
      }

      queryClient.invalidateQueries({ queryKey: ["costumes"] });
      resetForm();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // ค้นหา และ กรองชุด
  const filteredData =
    data?.filter(
      (costume) =>
        costume.name
          .toLowerCase()
          .includes(filterState.searchText.toLowerCase()) &&
        (filterState.categoryFilter
          ? costume.category.toString() === filterState.categoryFilter
          : true) &&
        (filterState.isRentableFilter !== null
          ? costume.isRentable === (filterState.isRentableFilter === 1)
          : true)
    ) || [];

  const handleToggleRentableStatus = (record) => {
    const nextValue = record.isRentable ? 0 : 1;
    const toggleText = nextValue === 1 ? "เปิดให้บริการ" : "ปิดการให้บริการ";

    Modal.confirm({
      title: "ยืนยันการเปลี่ยนสถานะ",
      content: `คุณแน่ใจหรือไม่ว่าจะ${toggleText}สำหรับชุด "${record.name}"?`,
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          await UpdateCostumeIsRentable(record.id, nextValue);
          message.success(`เปลี่ยนสถานะเป็น "${toggleText}" สำเร็จ`);
          queryClient.invalidateQueries({ queryKey: ["costumes"] });
        } catch (err) {
          console.error("เกิดข้อผิดพลาด:", err);
          toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
        }
      },
    });
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "ยืนยันการลบชุด",
      content: "คุณแน่ใจที่จะลบชุดนี้หรือไม่?",
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          await DeleteCostume(id);
          toast.success("ลบชุดสำเร็จ!");
          queryClient.invalidateQueries({ queryKey: ["costumes"] });
        } catch (error) {
          console.error("❌ เกิดข้อผิดพลาด:", error);
          toast.error("เกิดข้อผิดพลาดในการลบชุด");
        }
      },
    });
  };

  return (
    <Layout>
      {/* Navbar ด้านบน */}
      <Navbar />

      {/* Container ครอบเนื้อหา */}
      <Content
        style={{
          margin: "20px auto",
          maxWidth: 800,
          padding: 20,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3}>จัดการชุด</Title>

        {/* ค้นหาและกรองชุด */}
        <Input.Search
          placeholder="ค้นหาชุด..."
          allowClear
          onChange={(e) =>
            setFilterState({ ...filterState, searchText: e.target.value })
          }
          style={{ width: 200, marginRight: 10 }}
        />

        <Select
          placeholder="กรองตามประเภท"
          allowClear
          onChange={(value) =>
            setFilterState({ ...filterState, categoryFilter: value })
          }
          style={{ width: 200, marginRight: 10 }}
          showSearch
        >
          <Select.Option value="0">กิโมโน</Select.Option>
          <Select.Option value="1">ยูกาตะ</Select.Option>
          <Select.Option value="2">คอสเพลย์</Select.Option>
        </Select>

        {/* กรองตามการให้บริการ */}
        <Select
          placeholder="กรองการให้บริการ"
          allowClear
          onChange={(value) =>
            setFilterState({
              ...filterState,
              isRentableFilter: value !== undefined ? Number(value) : null,
            })
          }
          style={{ width: 200, marginBottom: 10 }}
        >
          <Select.Option value={1}>ให้บริการ</Select.Option>
          <Select.Option value={0}>ไม่ให้บริการ</Select.Option>
        </Select>

        <Button
          type="primary"
          onClick={() => openModal(null)}
          style={{ marginLeft: 10 }}
        >
          เพิ่มชุดใหม่
        </Button>

        {/* ตารางแสดงรายการชุด */}
        <Table
          columns={[
            {
              title: "รูปภาพ",
              dataIndex: "image_path",
              key: "image",
              render: (image_path) =>
                image_path ? (
                  <Image
                    src={image_path}
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
                  />
                ) : (
                  "ไม่มีรูปภาพ"
                ),
            },
            { title: "ชื่อชุด", dataIndex: "name", key: "name" },
            {
              title: "ประเภทชุด",
              dataIndex: "category",
              key: "category",
              render: (category) => {
                const categoryMap = { 0: "กิโมโน", 1: "ยูกาตะ", 2: "คอสเพลย์" };
                return categoryMap[category] || "ไม่ระบุ";
              },
            },
            {
              title: "การให้บริการ",
              dataIndex: "isRentable",
              key: "isRentable",
              align: "center",
              render: (isRentable, record) => {
                const isActive = Boolean(isRentable);
                const buttonText = isActive ? "ให้บริการ" : "ไม่ให้บริการ";

                return (
                  <Button
                    type="primary"
                    danger={!isActive}
                    style={
                      isActive
                        ? { backgroundColor: "#52c41a", borderColor: "#52c41a" }
                        : {}
                    }
                    onClick={() => handleToggleRentableStatus(record)}
                  >
                    {buttonText}
                  </Button>
                );
              },
            },
            {
              title: "การกระทำ",
              align: "center",
              render: (_, record) => (
                <>
                  <Button onClick={() => openModal(record)}>แก้ไข</Button>
                  <Button danger onClick={() => confirmDelete(record.id)}>
                    ลบ
                  </Button>
                </>
              ),
            },
          ]}
          dataSource={filteredData}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: pageSize, // จำนวนแถวต่อหน้า
            showQuickJumper: true, //  เปิดให้เลือกหน้า
            showSizeChanger: true, //  เปิดให้เลือกจำนวนแถวต่อหน้า
            pageSizeOptions: ["5", "10", "20", "50"], //  ตัวเลือกที่แสดง
            onShowSizeChange: (current, size) => setPageSize(size),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} จากทั้งหมด ${total} รายการ`,
          }}
          scroll={{ x: "max-content" }} // เพิ่ม scroll เมื่อหน้าจอเล็ก
        />

        {/* Modal เพิ่ม/แก้ไขชุด */}
        <CostumeFormModal
          open={costumeState.isModalOpen}
          onClose={() =>
            setCostumeState({ ...costumeState, isModalOpen: false })
          }
          onSubmit={onFinish}
          form={form}
          isLoading={isLoading}
          costumeState={costumeState}
          handleImageChange={handleImageChange}
          handleFormChange={handleFormChange}
        />
      </Content>
    </Layout>
  );
};

export default Costumes;
