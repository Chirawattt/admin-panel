// src/pages/Images.jsx
import React, { useEffect, useState } from "react";
import {
  Select,
  Upload,
  Button,
  Image,
  Popconfirm,
  message,
  Row,
  Col,
  Spin,
  Typography,
  Layout,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { FetchCostumes } from "../api/costumeApi";
import {
  FetchReviewImages,
  AddReviewImage,
  DeleteImage,
} from "../api/ImageApi";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";

const { Option, OptGroup } = Select;
const { Title } = Typography;

const Images = () => {
  const [costumes, setCostumes] = useState([]);
  const [userState, setUserState] = useState({});
  const [selectedCostumeId, setSelectedCostumeId] = useState(null);
  const [reviewImages, setReviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCostumes();
  }, []);

  useEffect(() => {
    if (selectedCostumeId) {
      fetchReviewImages(selectedCostumeId);
    } else {
      setReviewImages([]);
    }
    localStorage.getItem("username") &&
      setUserState({ username: localStorage.getItem("username") });
  }, [selectedCostumeId]);

  const fetchCostumes = async () => {
    try {
      const data = await FetchCostumes();
      setCostumes(data);
    } catch (err) {
      message.error("ไม่สามารถโหลดชุดได้");
    }
  };

  const fetchReviewImages = async (costumeId) => {
    setLoading(true);
    try {
      const data = await FetchReviewImages(costumeId);
      setReviewImages(data);
    } catch (err) {
      message.error("ไม่สามารถโหลดรูปภาพรีวิวได้");
    }
    setLoading(false);
  };

  const handleUpload = async ({ file }) => {
    if (!selectedCostumeId) {
      message.warning("กรุณาเลือกชุดก่อนอัปโหลดรูป");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("costume_id", selectedCostumeId);

    try {
      await AddReviewImage(formData);
      message.success("อัปโหลดรูปภาพสำเร็จ");
      fetchReviewImages(selectedCostumeId);
    } catch (err) {
      message.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await DeleteImage(imageId);
      message.success("ลบรูปภาพสำเร็จ");
      fetchReviewImages(selectedCostumeId);
    } catch (err) {
      message.error("เกิดข้อผิดพลาดในการลบรูปภาพ");
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      toast.success("ออกจากระบบสำเร็จ!");
      navigate("/");
    } catch {
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  return (
    <Layout>
      <Navbar
        username={userState.username}
        onLogout={handleLogout}
        onMenuClick={() => setIsDrawerOpen(true)}
        isDrawerOpen={isDrawerOpen}
        onCloseDrawer={() => setIsDrawerOpen(false)}
      />

      <Content
        style={{
          maxWidth: 1000,
          margin: "20px auto",
          padding: 20,
          background: "#fff",
          borderRadius: 8,
        }}
      >
        <Title level={3}>จัดการรูปภาพรีวิวของชุด</Title>

        {!selectedCostumeId && (
          <p style={{ color: "#d11b1b" }}>
            *กรุณาเลือกชุดก่อนทำการอัปโหลดรูปภาพ
          </p>
        )}
        <Select
          placeholder="เลือกชุด"
          onChange={(value) => setSelectedCostumeId(value)}
          style={{ width: 400, marginBottom: 20 }}
          allowClear
          showSearch
          optionFilterProp="label"
        >
          {[
            { label: "กิโมโน", value: 0 },
            { label: "ยูกาตะ", value: 1 },
            { label: "คอสเพลย์", value: 2 },
          ].map((group) => (
            <OptGroup key={group.value} label={group.label}>
              {costumes
                .filter((c) => c.category === group.value)
                .map((c) => (
                  <Option key={c.id} value={c.id} label={c.name}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <img
                        src={c.image_path}
                        style={{
                          width: 30,
                          height: 30,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                      <div>{c.name}</div>
                    </div>
                  </Option>
                ))}
            </OptGroup>
          ))}
        </Select>

        <Upload.Dragger
          customRequest={handleUpload}
          showUploadList={false}
          beforeUpload={(file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
              message.error("อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น");
              return Upload.LIST_IGNORE;
            }

            const isLt5M = file.size / 1024 / 1024 < 5; // 5MB
            if (!isLt5M) {
              message.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
              return Upload.LIST_IGNORE;
            }

            return true;
          }}
          accept="image/*"
          disabled={!selectedCostumeId}
          style={{ marginBottom: 20 }}
          multiple={true}
        >
          <p className="ant-upload-drag-icon">
            <PlusOutlined />
          </p>
          <p className="ant-upload-text">
            คลิกหรือวางไฟล์เพื่ออัปโหลดรูปภาพรีวิว
          </p>
        </Upload.Dragger>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => fetchReviewImages(selectedCostumeId)}
          disabled={!selectedCostumeId || loading}
          style={{ marginBottom: 20 }}
        >
          โหลดใหม่
        </Button>

        <p style={{ color: "#555" }}>
          จำนวนรูปภาพรีวิวทั้งหมด: <b>{reviewImages?.length}</b>
        </p>

        <div style={{ marginTop: 20 }}>
          {loading ? (
            <Spin />
          ) : reviewImages?.length === 0 ? (
            <p style={{ color: "#999" }}>ยังไม่มีรูปภาพรีวิวสำหรับชุดนี้</p>
          ) : (
            <Image.PreviewGroup>
              <Row gutter={[16, 16]}>
                {reviewImages?.map((img) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={img.id}>
                    <div style={{ position: "relative" }}>
                      <Image
                        src={`${img.image_path}`}
                        alt="review"
                        width="100%"
                        height={200}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                        preview={true}
                      />
                      <div
                        style={{ paddingTop: 8, fontSize: 12, color: "#666" }}
                      >
                        <div>ไฟล์: {img.image_path?.split("/").pop()}</div>
                        <div>
                          อัปโหลดเมื่อ:{" "}
                          {dayjs(img?.createdAt).format(
                            "D MMMM YYYY เวลา HH:mm น."
                          )}
                        </div>
                      </div>
                      <Popconfirm
                        title="ยืนยันการลบรูปนี้?"
                        okText="ลบ"
                        cancelText="ยกเลิก"
                        onConfirm={() => handleDelete(img.id)}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          style={{ position: "absolute", top: 8, right: 8 }}
                        />
                      </Popconfirm>
                    </div>
                  </Col>
                ))}
              </Row>
            </Image.PreviewGroup>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Images;
