import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import buddhistEra from "dayjs/plugin/buddhistEra";

// ใช้ plugins ที่จำเป็น
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(buddhistEra);

/**
 * แปลงเวลาจาก API ให้อยู่ในรูปแบบที่ถูกต้องตามโซนเวลาของประเทศไทย
 * @param {string|Date} date - วันที่ที่ได้จาก API
 * @param {string} format - รูปแบบการแสดงผล (ถ้าไม่ระบุจะคืนค่า dayjs object)
 * @returns {string|dayjs} วันที่ในรูปแบบที่กำหนด หรือ dayjs object
 */
export const formatThaiDate = (date, format) => {
  if (!date) return null;

  // แก้ปัญหาโดยบวกเวลาเพิ่ม 7 ชั่วโมงโดยตรง
  // สร้าง Date object จากวันที่ที่ได้รับ
  const originalDate = new Date(date);

  // เพิ่ม 7 ชั่วโมง (7 * 60 * 60 * 1000 มิลลิวินาที)
  const thaiTimeMillis = originalDate.getTime() + 7 * 60 * 60 * 1000;
  const adjustedDate = new Date(thaiTimeMillis);

  // ใช้ dayjs แปลงวันที่ที่ปรับแล้ว
  const thaiDate = dayjs(adjustedDate);

  return format ? thaiDate.format(format) : thaiDate;
};

/**
 * แปลงเวลาจาก API ให้อยู่ในรูปแบบ "เมื่อ xx นาทีที่แล้ว" ของไทย
 * @param {string|Date} date - วันที่ที่ได้จาก API
 * @returns {string} ข้อความแสดงเวลาที่ผ่านมา
 */
export const formatThaiRelativeTime = (date) => {
  if (!date) return null;

  // ใช้วันที่ที่ปรับด้วย formatThaiDate
  return formatThaiDate(date).locale("th").fromNow();
};

/**
 * แปลงเวลาให้แสดงในรูปแบบไทย ทั้งวันและเวลา
 * @param {string|Date} date - วันที่ที่ได้จาก API
 * @param {boolean} useBuddhistEra - แสดงปีเป็นพุทธศักราชหรือไม่ (default: false)
 * @returns {string} วันที่และเวลาในรูปแบบไทย
 */
export const formatFullThaiDate = (date, useBuddhistEra = false) => {
  if (!date) return null;

  const thaiDate = formatThaiDate(date);

  if (useBuddhistEra) {
    // แสดงเป็นพุทธศักราช (พ.ศ.)
    return thaiDate.format("DD MMM BBBB เวลา HH:mm:ss น.");
  }

  // แสดงเป็นคริสต์ศักราช (ค.ศ.)
  return thaiDate.format("D MMMM YYYY เวลา HH:mm:ss น.");
};

/**
 * แปลงเวลาให้แสดงในรูปแบบไทย ทั้งวันและเวลา
 * @param {string|Date} date - วันที่ที่ได้จาก API
 * @param {boolean} useBuddhistEra - แสดงปีเป็นพุทธศักราชหรือไม่ (default: false)
 * @returns {string} วันที่และเวลาในรูปแบบไทย
 */
export const formatThaiDateOnly = (date, useBuddhistEra = false) => {
  if (!date) return null;

  const thaiDate = formatThaiDate(date);

  if (useBuddhistEra) {
    // แสดงเป็นพุทธศักราช (พ.ศ.)
    return thaiDate.format("D MMMM BBBB");
  }

  // แสดงเป็นคริสต์ศักราช (ค.ศ.)
  return thaiDate.format("D MMMM YYYY");
};

/**
 * ตรวจสอบว่าวันที่ที่รับมาเป็นวันในอนาคตหรือไม่
 * @param {string|Date} date - วันที่ที่ต้องการตรวจสอบ
 * @returns {boolean} true ถ้าเป็นวันในอนาคต, false ถ้าไม่ใช่
 */
export const isFutureDate = (date) => {
  if (!date) return false;

  return formatThaiDate(date).isAfter(dayjs());
};

/**
 * แปลงเวลาให้แสดงในรูปแบบ ISO String ตามมาตรฐาน (เพื่อใช้ในการส่งข้อมูลกลับไปยัง API)
 * @param {string|Date} date - วันที่
 * @returns {string} วันที่ในรูปแบบ ISO String
 */
export const formatISODate = (date) => {
  if (!date) return null;
  return dayjs(date).toISOString();
};

export default {
  formatThaiDate,
  formatThaiRelativeTime,
  formatFullThaiDate,
  formatThaiDateOnly,
  isFutureDate,
  formatISODate,
};
