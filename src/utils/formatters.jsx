import { Tag } from "antd";
import React from "react";

/**
 * ฟังก์ชันแปลงข้อมูล category ให้เป็นข้อความภาษาไทย
 */
export const getCategoryDisplay = (category) => {
  const categoryMap = { 0: "กิโมโน", 1: "ยูกาตะ", 2: "คอสเพลย์" };
  return categoryMap[category] || "ไม่ระบุ";
};

/**
 * ฟังก์ชันแปลงข้อมูล age_group ให้เป็นข้อความภาษาไทย
 */
export const getAgeGroupDisplay = (ageGroup) => {
  const ageGroupMap = {
    children: "เด็ก",
    adult: "ผู้ใหญ่",
    both: "เด็กและผู้ใหญ่",
  };
  return ageGroupMap[ageGroup] || "ไม่ระบุ";
};

/**
 * ฟังก์ชันแปลงข้อมูล status ให้เป็นข้อความภาษาไทย
 */
export const getStatusDisplay = (status) => {
  return status === "1" ? "ว่าง" : "ติดคิว";
};

/**
 * ฟังก์ชันสร้าง Tag สถานะ
 */
export const getStatusTag = (status) => {
  return status === 1 ? (
    <Tag color="green">ว่าง</Tag>
  ) : (
    <Tag color="red">ติดคิว</Tag>
  );
};
