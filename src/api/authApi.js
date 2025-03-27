import { toast } from "react-toastify";
import api from "./axiosConfig";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  if (response.data) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.user.username);
    toast.success("เข้าสู่ระบบสำเร็จ!");
  }
  return response.data;
};
