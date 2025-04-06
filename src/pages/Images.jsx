// src/pages/Images.jsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  Typography,
  message,
  Row,
  Col,
  Space,
  Tooltip,
  Grid,
  Tabs,
  Input,
  Alert,
} from "antd";
import {
  SyncOutlined,
  PictureOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { FetchCostumes } from "../api/costumeApi";
import {
  FetchReviewImages,
  AddReviewImage,
  DeleteImage,
} from "../api/ImageApi";
import Navbar from "../components/shared/Navbar";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import "dayjs/locale/th";
import relativeTime from "dayjs/plugin/relativeTime";

// Import custom components
import StatusAlert from "../components/Images/StatusAlert";
import CostumeSelector from "../components/Images/CostumeSelector";
import SearchFilter from "../components/Images/SearchFilter";
import UploadSection from "../components/Images/UploadSection";
import ImageGallery from "../components/Images/ImageGallery";
import CostumeGrid from "../components/shared/CostumeGrid";

// Import custom hooks
import { useImageFilter } from "../hooks/Images/useImageFilter";

// กำหนดให้ dayjs ใช้ภาษาไทยและ plugin relativeTime
dayjs.locale("th");
dayjs.extend(relativeTime);

const { Title } = Typography;
const { useBreakpoint } = Grid;

const Images = () => {
  const screens = useBreakpoint();
  const [costumes, setCostumes] = useState([]);
  const [selectedCostumeId, setSelectedCostumeId] = useState(null);
  const [reviewImages, setReviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const [costumeSearchText, setCostumeSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("1");

  // Use the updated image filter hook
  const { sortOrder, setSortOrder, filteredImages, resetFilters } =
    useImageFilter(reviewImages);

  useEffect(() => {
    fetchCostumes();
  }, []);

  useEffect(() => {
    if (selectedCostumeId) {
      fetchReviewImages(selectedCostumeId);

      // Switch to the first tab only when a costume is INITIALLY selected from the second tab
      if (activeTab === "2") {
        setActiveTab("1");
      }
    } else {
      setReviewImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCostumeId]);

  const fetchCostumes = async () => {
    try {
      setConnectionError(null);
      const data = await FetchCostumes();
      setCostumes(data);
    } catch (err) {
      console.error("Error fetching costumes:", err);
      message.error("ไม่สามารถโหลดชุดได้");
      if (err.includes("Network Error") || !err.response) {
        setConnectionError(
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อหรือเซิร์ฟเวอร์"
        );
      } else {
        setConnectionError(`เกิดข้อผิดพลาด: ${err}`);
      }
    }
  };

  const fetchReviewImages = async (costumeId) => {
    setLoading(true);
    try {
      setConnectionError(null);
      const data = await FetchReviewImages(costumeId);
      setReviewImages(data);
    } catch (err) {
      console.error("Error fetching review images:", err);
      message.error("ไม่สามารถโหลดรูปภาพรีวิวได้");
      if (err.includes("Network Error") || !err.response) {
        setConnectionError(
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อหรือเซิร์ฟเวอร์"
        );
      } else {
        setConnectionError(`เกิดข้อผิดพลาด: ${err}`);
      }
    }
    setLoading(false);
  };

  const handleUpload = async ({ file }) => {
    if (!selectedCostumeId) {
      message.warning("กรุณาเลือกชุดก่อนอัปโหลดรูป");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("costume_id", selectedCostumeId);

    try {
      await AddReviewImage(formData);
      message.success("อัปโหลดรูปภาพสำเร็จ");
      setUploadedCount((prevCount) => prevCount + 1);
      fetchReviewImages(selectedCostumeId);
    } catch (error) {
      console.error("Upload error:", error);
      message.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await DeleteImage(imageId);
      message.success("ลบรูปภาพสำเร็จ");
      fetchReviewImages(selectedCostumeId);
    } catch (error) {
      console.error("Delete error:", error);
      message.error("เกิดข้อผิดพลาดในการลบรูปภาพ");
    }
  };

  const handleRetry = () => {
    fetchCostumes();
    if (selectedCostumeId) {
      fetchReviewImages(selectedCostumeId);
    }
  };

  // ฟังก์ชันสำหรับการจัดการเลือกชุดจากแท็บที่สอง
  const handleSelectCostumeFromGrid = (costume) => {
    setSelectedCostumeId(costume.id);
  };

  // หาชุดที่เลือกในปัจจุบัน
  const selectedCostume = costumes.find((c) => c.id === selectedCostumeId);

  // กรองชุดตามการค้นหา
  const filteredCostumes = costumeSearchText
    ? costumes.filter((c) =>
        c.name.toLowerCase().includes(costumeSearchText.toLowerCase())
      )
    : costumes;

  // จัดการเปลี่ยนแท็บ
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  // Replace the old filter component with the updated one
  const renderFilters = () => (
    <SearchFilter
      sortOrder={sortOrder}
      onSortChange={(value) => setSortOrder(value)}
      onReset={resetFilters}
    />
  );

  // Update the renderContent method to use filteredImages and handle both tabs
  const renderContent = () => {
    if (activeTab === "1") {
      return (
        <>
          {renderFilters()}
          <ImageGallery
            images={filteredImages}
            loading={loading}
            onDelete={handleDelete}
          />
        </>
      );
    } else if (activeTab === "2") {
      return (
        <>
          <Alert
            message="เลือกชุดเพื่อดูรูปภาพรีวิว"
            description="คุณสามารถคลิกที่ชุดด้านล่างเพื่อดูรูปภาพรีวิวที่เกี่ยวข้อง"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Input.Search
            placeholder="ค้นหาชื่อชุด"
            allowClear
            style={{ marginBottom: 16, maxWidth: 400 }}
            onChange={(e) => setCostumeSearchText(e.target.value)}
            value={costumeSearchText}
          />

          <CostumeGrid
            costumes={filteredCostumes}
            selectedCostumeId={selectedCostumeId}
            onSelect={handleSelectCostumeFromGrid}
            loading={costumes.length === 0}
          />
        </>
      );
    }
  };

  // สร้าง items สำหรับ Tabs component
  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <PictureOutlined /> จัดการรูปภาพ
        </span>
      ),
      children: (
        <>
          <div style={{ marginBottom: 16 }}>
            {!connectionError && (
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} md={12}>
                  <CostumeSelector
                    costumes={costumes}
                    selectedCostumeId={selectedCostumeId}
                    onChange={setSelectedCostumeId}
                    loading={costumes.length === 0}
                  />
                </Col>
              </Row>
            )}
          </div>

          {selectedCostumeId && (
            <>
              <UploadSection
                onUpload={handleUpload}
                onRefresh={() => fetchReviewImages(selectedCostumeId)}
                isDisabled={!selectedCostumeId}
                isUploading={uploading}
                isLoading={loading}
                imagesCount={filteredImages.length}
                uploadedCount={uploadedCount}
              />

              <div style={{ marginTop: 20 }}>{renderContent()}</div>
            </>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <FilterOutlined /> ดูรูปภาพตามชุด
        </span>
      ),
      children: <div style={{ marginBottom: 24 }}>{renderContent()}</div>,
    },
  ];

  return (
    <Layout>
      <Navbar />

      <Content
        style={{
          margin: screens.xs ? "10px" : "20px auto",
          maxWidth: screens.lg ? 1100 : "100%",
          padding: screens.xs ? 10 : 20,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16, marginTop: connectionError ? 16 : 0 }}
          wrap={true}
        >
          <Col xs={24} sm={12}>
            <Title level={screens.xs ? 4 : 3}>จัดการรูปภาพรีวิวของชุด</Title>
          </Col>
          <Col
            xs={24}
            sm={12}
            style={{
              textAlign: screens.xs ? "left" : "right",
              marginTop: screens.xs ? 10 : 0,
            }}
          >
            <Space>
              <Tooltip title="โหลดข้อมูลใหม่">
                <Button
                  icon={<SyncOutlined />}
                  onClick={handleRetry}
                  loading={loading}
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>

        <StatusAlert
          connectionError={connectionError}
          onRetry={handleRetry}
          selectedCostumeId={selectedCostumeId}
          selectedCostumeName={selectedCostume?.name}
          filteredImagesCount={filteredImages.length}
        />

        <Tabs
          defaultActiveKey="1"
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
        />
      </Content>
    </Layout>
  );
};

export default Images;
