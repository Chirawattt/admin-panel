import api from "./axiosConfig";

// นำเข้าหรือกำหนดค่า IMAGE_BASE_URL เช่นเดียวกับที่ใช้ใน ImageApi.js
const getImageBaseUrl = () => {
  // ถ้ารันบน localhost แสดงว่าเป็น development environment
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  // ถ้าไม่ใช่ localhost แสดงว่าเป็น production จึงใช้ host เดียวกับที่ deploy
  return window.location.origin;
};

const IMAGE_BASE_URL = getImageBaseUrl();

export const FetchCostumes = async () => {
  const response = await api.get("/costumes");

  return response.data.map((costume) => ({
    ...costume,
    image_name: costume.image_path
      .split("/")
      .pop()
      .split("-")
      .slice(1)
      .join(""),
    image_path: costume.image_path.startsWith("http")
      ? costume.image_path // ถ้าเป็น URL เต็มแล้วให้ใช้เลย
      : `${IMAGE_BASE_URL}/${costume.image_path.replace(/^\//, "")}`, // ป้องกันการมี / ซ้ำ
  }));
};

export const FetchRentableCostumes = async () => {
  const response = await api.get("/costumes/rentable");
  return response.data.map((costume) => ({
    ...costume,
    image_name: costume.image_path
      .split("/")
      .pop()
      .split("-")
      .slice(1)
      .join(""),
    image_path: costume.image_path.startsWith("http")
      ? costume.image_path // ถ้าเป็น URL เต็มแล้วให้ใช้เลย
      : `${IMAGE_BASE_URL}/${costume.image_path.replace(/^\//, "")}`, // ป้องกันการมี / ซ้ำ
  }));
};

export const AddCostume = async (costumeData) => {
  const response = await api.post("/costumes", costumeData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const UpdateCostume = async (id, costumeData) => {
  const response = await api.put(`/costumes/${id}`, costumeData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const FetchReviewImages = async (id) => {
  const response = await api.get(`/costumes/${id}/reviewImages`);
  return response.data.map((review) => ({
    ...review,
    image_path: review.image_path.startsWith("http")
      ? review.image_path // ถ้าเป็น URL เต็มแล้วให้ใช้เลย
      : `${IMAGE_BASE_URL}/${review.image_path.replace(/^\//, "")}`, // ป้องกันการมี / ซ้ำ
  }));
};

export const DeleteCostume = async (id) => {
  await api.delete(`/costumes/${id}`);
};

export const UpdateCostumeIsRentable = async (id, isRentable) => {
  const response = await api.put(`/costumes/${id}/isRentable`, { isRentable });
  return response.data;
};

export const UpdateCostumeStatus = async (id, status) => {
  const response = await api.put(`/costumes/${id}/status`, { status });
  return response.data;
};

export const ResetAllCostumeStatusToAvailable = async () => {
  const response = await api.put("/costumes/resetStatus");
  return response.data;
};
