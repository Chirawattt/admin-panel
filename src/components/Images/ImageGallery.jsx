import React from "react";
import { Empty, Image, Row, Col, Typography, Skeleton } from "antd";
import ImageCard from "./ImageCard";

const { Text } = Typography;

/**
 * Component สำหรับแสดงแกลเลอรี่รูปภาพ
 */
const ImageGallery = ({ images, loading, onDelete, searchText }) => {
  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <Row gutter={[16, 16]}>
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <div style={{ marginBottom: 16 }}>
              <Skeleton.Image active style={{ width: "100%", height: 200 }} />
              <Skeleton
                active
                paragraph={{ rows: 1 }}
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
        ))}
    </Row>
  );

  if (loading) {
    return renderLoadingSkeleton();
  }

  if (!images || images.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span>
            ยังไม่มีรูปภาพรีวิวสำหรับชุดนี้{" "}
            {searchText && <Text type="secondary">(ตามเงื่อนไขการค้นหา)</Text>}
          </span>
        }
      />
    );
  }

  return (
    <Image.PreviewGroup>
      <Row gutter={[16, 16]}>
        {images.map((img) => (
          <Col xs={24} sm={12} md={8} lg={6} key={img.id}>
            <ImageCard img={img} onDelete={onDelete} />
          </Col>
        ))}
      </Row>
    </Image.PreviewGroup>
  );
};

export default ImageGallery;
