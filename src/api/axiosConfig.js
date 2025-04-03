import axios from "axios";
import { toast } from "react-toastify";

// กำหนดค่า baseURL สำหรับ API ให้เป็น path ที่ถูกต้อง
// สำหรับ development environment ใช้ http://localhost:5000/api
// สำหรับ production environment ใช้ [origin]/api
const getBaseUrl = () => {
  // ถ้ารันบน localhost แสดงว่าเป็น development environment
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }
  // ถ้าไม่ใช่ localhost แสดงว่าเป็น production จึงใช้ host เดียวกับที่ deploy
  return `${window.location.origin}/api`;
};

// สร้าง instance ของ axios ที่มี baseURL ตามที่เรากำหนด
const api = axios.create({
  baseURL: getBaseUrl(),
});

// Interceptor แนบ Token ในทุก Request ที่ส่งไปยัง Server
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor ดักจับ Error 401 และ 403 ที่เกิดจาก Server เพื่อเด้งไปหน้า Login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.warning("กรุณาเข้าสู่ระบบก่อนใช้งาน");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
    return Promise.reject(error);
  }
);

export default api;
