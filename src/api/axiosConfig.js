import axios from "axios";
import { toast } from "react-toastify";

// สร้าง instance ของ axios ที่มี baseURL ตามที่เรากำหนด
const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
