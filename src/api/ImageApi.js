import api from "./axiosConfig";

// กำหนดค่า baseURL สำหรับรูปภาพ - ปรับให้ใช้ค่าจาก window.location.origin ถ้าเป็น production
// หรือใช้ localhost:5000 ถ้าเป็น development
const getImageBaseUrl = () => {
  // ถ้ารันบน localhost แสดงว่าเป็น development environment
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  // ถ้าไม่ใช่ localhost แสดงว่าเป็น production จึงใช้ host เดียวกับที่ deploy
  return window.location.origin;
};

const IMAGE_BASE_URL = getImageBaseUrl();

/**
 * ปรับ URL ของรูปภาพให้ถูกต้อง
 * @param {string} imagePath - path ของรูปภาพที่ได้รับจาก API
 * @returns {string} URL เต็มของรูปภาพ
 */
const fixImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // ถ้ามี http อยู่แล้ว ให้ใช้ path เดิม
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // กรณีที่เริ่มต้นด้วย /uploads ให้ตัด / ข้างหน้าออกก่อน
  const cleanPath = imagePath.replace(/^\//, "");

  // รวม base URL กับ path ของรูปภาพ
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};

// ดึงข้อมูลรูปภาพทั้งหมด
export const FetchAllImages = async () => {
  const response = await api.get("/images");
  return response.data.map((image) => ({
    ...image,
    image_path: fixImageUrl(image.image_path),
  }));
};

// ดึงข้อมูลรูปภาพรีวิวตามชุด
export const FetchReviewImages = async (id) => {
  const response = await api.get(`/images/costume/${id}`);

  if (!response.data || !Array.isArray(response.data)) {
    return [];
  }

  return response.data.map((review) => {
    // ตรวจสอบว่า review.image_path มีค่าหรือไม่
    if (!review.image_path) {
      return {
        ...review,
        image_path: null,
      };
    }

    return {
      ...review,
      image_path: fixImageUrl(review.image_path),
    };
  });
};

// ดึงรูปภาพรีวิวตาม ID
export const FetchReviewImageById = async (id) => {
  const response = await api.get(`/images/${id}`);
  return {
    ...response.data,
    image_path: fixImageUrl(response.data.image_path),
  };
};

// อัปโหลดรูปภาพ
export const AddReviewImage = async (imageData) => {
  const response = await api.post("/images/upload", imageData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ลบรูปภาพ
export const DeleteImage = async (id) => {
  const response = await api.delete(`/images/${id}`);
  return response.data;
};
