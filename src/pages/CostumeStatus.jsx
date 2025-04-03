// src/pages/CostumeStatus.jsx
import React, { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Select,
  Tag,
  Button,
  Modal,
  message,
  Spin,
  Typography,
} from "antd";
import {
  FetchRentableCostumes,
  UpdateCostumeStatus,
  ResetAllCostumeStatusToAvailable,
} from "../api/costumeApi";
import Navbar from "../components/Navbar";

import dayjs from "dayjs";

const { Content } = Layout;
const { Option } = Select;

const CostumeStatus = () => {
  const [costumes, setCostumes] = useState([]);
  const [filterState, setFilterState] = useState({
    search: "",
    categoryFilter: null,
    statusFilter: "all",
  });

  const [selectedCostume, setSelectedCostume] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;

  const fetchCostumes = async () => {
    setLoading(true);
    try {
      const data = await FetchRentableCostumes();
      setCostumes(data);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("ไม่สามารถโหลดข้อมูลชุดได้");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCostumes();
  }, []);

  const filterCostumes = React.useMemo(
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
            : true)
      ) || [],
    [
      costumes,
      filterState.search,
      filterState.categoryFilter,
      filterState.statusFilter,
    ]
  );

  const resetAllCostumeStatusToAvailable = async () => {
    setLoading(true);
    try {
      await ResetAllCostumeStatusToAvailable();
      message.success("รีเซ็ตสถานะชุดทั้งหมดเรียบร้อยแล้ว");
      fetchCostumes(); // โหลดข้อมูลใหม่
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      message.error("เกิดข้อผิดพลาดในการรีเซ็ตสถานะ");
    }
    setLoading(false);
  };

  const getStatusTag = (status) => {
    return status === 1 ? (
      <Tag color="green">ว่าง</Tag>
    ) : (
      <Tag color="red">ติดคิว</Tag>
    );
  };

  const handleStatusToggle = async () => {
    const newStatus = selectedCostume.status === 1 ? 0 : 1;
    try {
      await UpdateCostumeStatus(selectedCostume.id, newStatus);
      message.success("เปลี่ยนสถานะสำเร็จ");
      setDetailVisible(false);
      setHighlightedId(selectedCostume.id); // ตั้งค่า ID ที่ถูกคลิก
      fetchCostumes();

      // ลบ ID ที่ถูกคลิกหลังจาก 2 วินาที
      setTimeout(() => setHighlightedId(null), 800);
    } catch {
      message.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    }
  };

  return (
    <Layout>
      {/* Navbar ด้านบน */}
      <Navbar />

      {/* Container ครอบเนื้อหา */}
      <Content
        style={{
          margin: "20px auto",
          maxWidth: 1000,
          padding: 20,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3}>จัดการสถานะชุด</Title>

        {/* ✅ ค้นหาและกรองชุด */}
        <Input.Search
          placeholder="ค้นหาชื่อชุด"
          allowClear
          onChange={(e) =>
            setFilterState({ ...filterState, search: e.target.value })
          }
          style={{ width: 200, marginRight: 10, marginBottom: 10 }}
        />

        <Select
          placeholder="กรองตามประเภท"
          allowClear
          onChange={(value) =>
            setFilterState({ ...filterState, categoryFilter: value })
          }
          style={{ width: 200, marginRight: 10, marginBottom: 10 }}
        >
          <Option value="0">กิโมโน</Option>
          <Option value="1">ยูกาตะ</Option>
          <Option value="2">คอสเพลย์</Option>
        </Select>

        <Select
          placeholder="กรองตามสถานะ"
          allowClear
          style={{ width: 200, marginRight: 10, marginBottom: 10 }}
          onChange={(value) =>
            setFilterState({ ...filterState, statusFilter: value })
          }
        >
          <Option value="all">ทั้งหมด</Option>
          <Option value="1">ว่าง</Option>
          <Option value="0">ติดคิว</Option>
        </Select>

        <Button
          type="primary"
          onClick={() => {
            Modal.confirm({
              title: "ยืนยันการรีเซ็ตสถานะทั้งหมด?",
              content:
                "คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตสถานะชุดทั้งหมดให้เป็น 'ว่าง'?",
              okText: "ยืนยัน",
              cancelText: "ยกเลิก",
              onOk: async () => {
                try {
                  // ✅ ถ้ามี API รองรับ → เรียก API เดียวเลย
                  await resetAllCostumeStatusToAvailable();
                  // eslint-disable-next-line no-unused-vars
                } catch (err) {
                  message.error("เกิดข้อผิดพลาดในการรีเซ็ตสถานะ");
                }
              },
            });
          }}
        >
          รีเซ็ตทั้งหมดเป็นว่าง
        </Button>

        {/* ✅ รายการชุดเป็น Card */}
        {filterCostumes.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 40, color: "#999" }}>
            <p style={{ fontSize: 20 }}>😢 ไม่พบชุดที่ตรงกับเงื่อนไข</p>
            <p>โปรดลองเปลี่ยนคำค้นหาหรือกรองประเภทใหม่</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
              marginTop: 24,
            }}
          >
            {loading ? (
              <div style={{ textAlign: "center", marginTop: 50 }}>
                <Spin size="large" />
              </div>
            ) : (
              filterCostumes.map((costume) => {
                const isAvailable = costume.status === 1;
                return (
                  <div
                    key={costume.id}
                    onClick={() => {
                      setSelectedCostume(costume);
                      setDetailVisible(true);
                    }}
                    style={{
                      width: 220,
                      cursor: "pointer",
                      borderRadius: 8,
                      overflow: "hidden",
                      backgroundColor: isAvailable ? "#adffd3" : "#fcb5a7",
                      position: "relative",
                      transition: "box-shadow 0.3s, transform 0.3s",
                      boxShadow:
                        highlightedId === costume.id
                          ? "0 0 0 4px rgb(80, 80, 80) inset"
                          : "0px 2px 8px rgba(0,0,0,0.15)",
                      transform:
                        highlightedId === costume.id
                          ? "scale(1.02)"
                          : "scale(1)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1,
                      }}
                    >
                      {getStatusTag(costume.status)}
                    </div>

                    <img
                      src={costume.image_path}
                      alt={costume.name}
                      style={{ width: "100%", height: 250, objectFit: "cover" }}
                    />

                    <div style={{ padding: 12, textAlign: "center" }}>
                      <h4 style={{ margin: 0 }}>{costume.name}</h4>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Modal แสดงรายละเอียดและเปลี่ยนสถานะ */}
        <Modal
          title={selectedCostume?.name}
          open={detailVisible}
          onCancel={() => setDetailVisible(false)}
          footer={[
            <Button key="back" onClick={() => setDetailVisible(false)}>
              ยกเลิก
            </Button>,
            <Button
              key="status"
              type={selectedCostume?.status === 0 ? "primary" : "primary"}
              danger={selectedCostume?.status === 1} // ถ้าจะเปลี่ยนเป็นติดคิว → danger
              style={{
                backgroundColor:
                  selectedCostume?.status === 0 ? "#52c41a" : undefined, // ถ้าจะเปลี่ยนเป็นว่าง → เขียว
                borderColor:
                  selectedCostume?.status === 0 ? "#52c41a" : undefined,
              }}
              onClick={handleStatusToggle}
            >
              เปลี่ยนสถานะเป็น{" "}
              {selectedCostume?.status === 1 ? "ติดคิว" : "ว่าง"}
            </Button>,
          ]}
        >
          {/* รูปภาพขนาดกลาง ไม่เต็ม modal */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <img
              src={selectedCostume?.image_path}
              alt={selectedCostume?.name}
              style={{
                maxWidth: 300,
                maxHeight: 300,
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>

          {/* แสดงรายละเอียดชุด */}
          <p>
            <b>ชื่อ:</b> {selectedCostume?.name}
          </p>
          <p>
            <b>หมวดหมู่:</b>{" "}
            {{
              0: "กิโมโน",
              1: "ยูกาตะ",
              2: "คอสเพลย์",
            }[selectedCostume?.category] || "ไม่ระบุ"}
          </p>
          <p>
            <b>สถานะปัจจุบัน:</b> {getStatusTag(selectedCostume?.status)}
          </p>
          <p style={{ color: "#888" }}>
            <b>อัปเดตสถานะล่าสุด: </b>
            {dayjs(selectedCostume?.updatedAt).fromNow()}
            <br />
            {dayjs(selectedCostume?.updatedAt).format(
              "D MMMM YYYY เวลา HH:mm น."
            )}
          </p>
        </Modal>
      </Content>
    </Layout>
  );
};

export default CostumeStatus;
