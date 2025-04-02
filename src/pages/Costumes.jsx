import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Layout,
  Typography,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FetchCostumes,
  AddCostume,
  UpdateCostume,
  UpdateCostumeIsRentable,
  DeleteCostume,
} from "../api/costumeApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import Navbar component

const { Content } = Layout;
const { Title } = Typography;

const Costumes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["costumes"],
    queryFn: FetchCostumes,
  });

  const [costumeState, setCostumeState] = useState({
    isModalOpen: false,
    editCostume: null,
    selectedImage: null,
    previewImage: null,
    isChange: false,
  });

  const [userState, setUserState] = useState({
    username: localStorage.getItem("username"),
  });

  const [filterState, setFilterState] = useState({
    searchText: "",
    categoryFilter: "",
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // สำหรับ Modal แสดงรูปภาพใหญ่
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // สำหรับการตั้งค่าการแสดงผลในตาราง
  const [pageSize, setPageSize] = useState(10);

  const [form] = Form.useForm();

  const openModal = (costume) => {
    if (costume) {
      form.setFieldsValue({
        ...costume,
        category: costume.category.toString(),
      });

      setCostumeState({
        isModalOpen: true,
        editCostume: costume,
        selectedImage: null,
        previewImage: costume.image_path,
        isChange: false,
      });
    } else {
      form.resetFields();
      setCostumeState({
        isModalOpen: true,
        editCostume: null,
        selectedImage: null,
        previewImage: null,
        isChange: false,
      });
    }
  };

  // แสดง Preview ของรูปที่เลือก
  const handleImageChange = (info) => {
    const file = info.file;
    // ตรวจสอบประเภทไฟล์
    if (!file || !file.type.startsWith("image/")) {
      toast.error("โปรดเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }

    // แสดงตัวอย่างรูปภาพ
    const reader = new FileReader();
    reader.onload = () => {
      setCostumeState({
        ...costumeState,
        selectedImage: file,
        previewImage: reader.result,
        isChange: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFormChange = () => {
    setCostumeState({ ...costumeState, isChange: true });
  };

  // ฟังก์ชันอัปเดตชุด
  const updateCostume = async (id, values) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("category", values.category);
    formData.append("age_group", values.age_group);

    if (costumeState.selectedImage) {
      formData.append("image", costumeState.selectedImage);
    }

    try {
      await UpdateCostume(id, formData); // อัปเดตข้อมูลชุดจาก costumeApi.js
      toast.success("อัปเดตข้อมูลชุดสำเร็จ!");
      queryClient.invalidateQueries({ queryKey: ["costumes"] });
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตชุด");
    }
  };

  // ฟังก์ชันจัดการการบันทึก (เพิ่ม/แก้ไข)
  const onFinish = async (values) => {
    if (costumeState.editCostume) {
      await updateCostume(costumeState.editCostume.id, values);
    } else {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("age_group", values.age_group);
      formData.append("image", costumeState.selectedImage);

      try {
        await AddCostume(formData);
        toast.success("เพิ่มชุดใหม่สำเร็จ!");
        queryClient.invalidateQueries({ queryKey: ["costumes"] });
      } catch (error) {
        console.error("❌ เกิดข้อผิดพลาด:", error);
        toast.error("เกิดข้อผิดพลาดในการเพิ่มชุดใหม่");
      }
    }

    setCostumeState({
      ...costumeState,
      isModalOpen: false,
      editCostume: null,
      selectedImage: null,
      previewImage: null,
      isChanged: false,
    });

    form.resetFields();
  };

  // ค้นหา และ กรองชุด
  const filteredData = data?.filter(
    (costume) =>
      costume.name
        .toLowerCase()
        .includes(filterState.searchText.toLowerCase()) &&
      (filterState.categoryFilter
        ? costume.category.toString() === filterState.categoryFilter
        : true)
  );

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

  const handleLogout = async () => {
    try {
      localStorage.clear(); // ลบข้อมูลใน localStorage ทั้งหมด
      toast.success("ออกจากระบบสำเร็จ!"); // toast แจ้งเตือน
      navigate("/"); // ไปหน้า Login
    } catch {
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.error("โปรดเข้าสู่ระบบก่อนใช้งาน");
      navigate("/");
    }
    localStorage.getItem("username") &&
      setUserState({ username: localStorage.getItem("username") });
  }, [navigate]);

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
      <Navbar
        username={userState.username}
        onLogout={handleLogout}
        onMenuClick={() => setIsDrawerOpen(true)}
        isDrawerOpen={isDrawerOpen}
        onCloseDrawer={() => setIsDrawerOpen(false)}
      />
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
          style={{ width: 200, marginBottom: 10 }}
        >
          <Select.Option value="0">กิโมโน</Select.Option>
          <Select.Option value="1">ยูกาตะ</Select.Option>
          <Select.Option value="2">คอสเพลย์</Select.Option>
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
                  <img
                    src={image_path}
                    alt="costume"
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 5,
                      boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                    }}
                    onClick={() => {
                      setSelectedImage(image_path);
                      setIsImageModalOpen(true);
                    }}
                  />
                ) : (
                  "ไม่มีรูปภาพ"
                ),
            },
            { title: "ชื่อชุด", dataIndex: "name", key: "name" },
            { title: "ราคาเช่า", dataIndex: "price", key: "price" },
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
        <Modal
          title={costumeState.editCostume ? "แก้ไขชุด" : "เพิ่มชุดใหม่"}
          open={costumeState.isModalOpen}
          onCancel={() =>
            setCostumeState({ ...costumeState, isModalOpen: false })
          }
          onOk={() => form.submit()}
          okButtonProps={{
            disabled: !costumeState.isChange,
            loading: isLoading,
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={handleFormChange}
          >
            {/* อัปโหลดรูปภาพ */}
            <Form.Item label="อัปโหลดรูปภาพ">
              <Upload
                beforeUpload={() => false}
                onChange={handleImageChange}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
              </Upload>
              {/* ข้อความเตือนว่าต้องอัพโหลดรูปภาพชุดทุกครั้งในการเพิ่มชุด */}
              {!costumeState.editCostume && (
                <p style={{ color: "red" }}>
                  * โปรดอัปโหลดรูปภาพชุดทุกครั้งในการเพิ่มชุด
                </p>
              )}
              {/* แสดงชื่อไฟล์ที่เลือก */}
              {(costumeState.selectedImage ||
                costumeState.editCostume?.image_name) && (
                <p style={{ marginTop: 10 }}>
                  ไฟล์ที่เลือก:{" "}
                  {costumeState.selectedImage?.name ||
                    costumeState.editCostume?.image_name}
                </p>
              )}

              {/* แสดง Preview รูปภาพ */}
              {costumeState.previewImage && (
                <img
                  src={costumeState.previewImage}
                  alt="preview"
                  style={{ width: "100%", borderRadius: 8 }}
                />
              )}
            </Form.Item>

            <Form.Item
              label="ชื่อชุด"
              name="name"
              rules={[{ required: true, message: "โปรดกรอกชื่อชุด" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="ราคาเช่า"
              name="price"
              rules={[{ required: true, message: "โปรดกรอกราคาเช่า" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item
              label="ประเภทชุด"
              name="category"
              rules={[{ required: true, message: "โปรดเลือกประเภทชุด" }]}
            >
              <Select>
                <Select.Option value="0">กิโมโน</Select.Option>
                <Select.Option value="1">ยูกาตะ</Select.Option>
                <Select.Option value="2">คอสเพลย์</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="กลุ่มอายุ"
              name="age_group"
              rules={[{ required: true, message: "โปรดเลือกกลุ่มอายุ" }]}
            >
              <Select>
                <Select.Option value="child">เด็ก</Select.Option>
                <Select.Option value="adult">ผู้ใหญ่</Select.Option>
                <Select.Option value="both">เด็กและผู้ใหญ่</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/*  Modal แสดงรูปภาพใหญ่ */}
        <Modal
          open={isImageModalOpen}
          footer={null}
          onCancel={() => setIsImageModalOpen(false)}
          centered
          width={800} //  กำหนดความกว้างให้ใหญ่ขึ้น
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={selectedImage}
              alt="Enlarged costume"
              style={{
                maxWidth: "100%", // ป้องกันรูปใหญ่เกิน Modal
                maxHeight: "80vh", // ป้องกันรูปสูงเกินจอ
                objectFit: "contain", // คงอัตราส่วนของรูป
                borderRadius: 8,
              }}
            />
          </div>
        </Modal>
      </Content>
    </Layout>
  );
};

export default Costumes;
