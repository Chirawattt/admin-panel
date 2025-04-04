import api from "./axiosConfig";
/**
 * ฟังก์ชันสำหรับเข้าสู่ระบบ
 * @param {Object} data - ข้อมูลเข้าสู่ระบบ ประกอบด้วย username และ password
 * @returns {Promise} ผลลัพธ์การเข้าสู่ระบบ
 */
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    const { token, user } = response.data;
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        username: user.username,
        userRole: user.userRole || "user",
      })
    );

    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

/**
 * ฟังก์ชันสำหรับสมัครสมาชิก
 * @param {Object} data - ข้อมูลสมัครสมาชิก ประกอบด้วย username, email, password, phone
 * @returns {Promise} ผลลัพธ์การสมัครสมาชิก
 */
export const register = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

/**
 * ฟังก์ชันสำหรับออกจากระบบ
 * @returns {void}
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // อาจจะมีการเรียก API เพื่อ invalidate token ที่ server ด้วยถ้าจำเป็น
};

/**
 * ฟังก์ชันตรวจสอบว่ามีการเข้าสู่ระบบอยู่หรือไม่
 * @returns {boolean} สถานะการเข้าสู่ระบบ
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

/**
 * ฟังก์ชันดึงข้อมูลผู้ใช้ปัจจุบัน
 * @returns {Object|null} ข้อมูลผู้ใช้
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * ฟังก์ชันสำหรับขอรหัส OTP สำหรับรีเซ็ตรหัสผ่าน
 * @param {Object} data - ข้อมูลผู้ใช้ ประกอบด้วย email เท่านั้น
 * @returns {Promise} ผลลัพธ์การส่งรหัส OTP
 */
export const requestOTP = async (data) => {
  try {
    const response = await api.post("/auth/forgot-password", {
      email: data.email,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

/**
 * ฟังก์ชันสำหรับตั้งรหัสผ่านใหม่พร้อมยืนยัน OTP
 * @param {Object} data - ข้อมูลรีเซ็ตรหัสผ่าน ประกอบด้วย email, otp และ newPassword
 * @returns {Promise} ผลลัพธ์การตั้งรหัสผ่านใหม่
 */
export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับ Admin เท่านั้น)
 * @returns {Promise} ผลลัพธ์การดึงข้อมูลผู้ใช้
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get("/auth/users");
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

/**
 * ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้ (สำหรับ Admin เท่านั้น)
 * @param {string} userId - ID ของผู้ใช้ที่ต้องการอัปเดต
 * @param {Object} userData - ข้อมูลที่ต้องการอัปเดต เช่น role, name, email เป็นต้น
 * @returns {Promise} ผลลัพธ์การอัปเดตข้อมูลผู้ใช้
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/auth/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

/**
 * ฟังก์ชันสำหรับลบผู้ใช้ (สำหรับ Admin เท่านั้น)
 * @param {string} userId - ID ของผู้ใช้ที่ต้องการลบ
 * @returns {Promise} ผลลัพธ์การลบผู้ใช้
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

/**
 * ฟังก์ชันสำหรับตรวจสอบว่าผู้ใช้เป็น Admin หรือไม่
 * @returns {boolean} ผลการตรวจสอบว่าเป็น Admin หรือไม่
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.userRole === "admin";
};
