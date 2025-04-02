import api from "./axiosConfig";

// ดึงข้อมูลรูปภาพทั้งหมด
export const FetchAllImages = async () => {
  const response = await api.get("/images");
  return response.data.map((image) => ({
    ...image,
    image_path: `http://localhost:5000/${image.image_path}`,
  }));
};

// ดึงข้อมูลรูปภาพรีวิวตามชุด
export const FetchReviewImages = async (id) => {
  const response = await api.get(`/images/costume/${id}`);
  return response.data.map((review) => ({
    ...review,
    image_path: `http://localhost:5000/${review.image_path}`,
  }));
};

// ดึงรูปภาพรีวิวตาม ID
export const FetchReviewImageById = async (id) => {
  const response = await api.get(`/images/${id}`);
  return {
    ...response.data,
    image_path: `http://localhost:5000/${response.data.image_path}`,
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
  await api.delete(`/images/${id}`);
};
