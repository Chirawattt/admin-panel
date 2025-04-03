import { toast } from "react-toastify";
import { AddCostume, UpdateCostume } from "../../api/costumeApi";

/**
 * Custom hook สำหรับจัดการการส่งฟอร์ม
 */
const useFormSubmission = (queryClient, resetForm) => {
  const onFinish = async (values, costumeState) => {
    try {
      //  ถ้าเพิ่มชุดใหม่ ต้องมีรูปภาพ
      if (!costumeState.editCostume && !costumeState.selectedImage) {
        toast.error("โปรดอัปโหลดรูปภาพก่อนเพิ่มชุด");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("age_group", values.age_group);

      if (costumeState.selectedImage) {
        formData.append("image", costumeState.selectedImage);
      }

      if (costumeState.editCostume) {
        // แก้ไข
        await UpdateCostume(costumeState.editCostume.id, formData);
        toast.success("แก้ไขข้อมูลชุดสำเร็จ");
      } else {
        // เพิ่มใหม่
        await AddCostume(formData);
        toast.success("เพิ่มชุดใหม่สำเร็จ");
      }

      queryClient.invalidateQueries({ queryKey: ["costumes"] });
      resetForm();
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return { onFinish };
};

export default useFormSubmission;
