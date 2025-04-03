import { Modal, message } from "antd";
import { toast } from "react-toastify";
import { UpdateCostumeIsRentable, DeleteCostume } from "../../api/costumeApi";

/**
 * Custom hook สำหรับจัดการ actions ของชุด
 */
const useCostumeActions = (queryClient) => {
  const handleToggleRentableStatus = (record) => {
    const nextValue = record.isRentable ? 0 : 1;
    const toggleText = nextValue === 1 ? "เปิดให้บริการ" : "ปิดการให้บริการ";

    Modal.confirm({
      title: "ยืนยันการเปลี่ยนสถานะ",
      content: `คุณแน่ใจหรือไม่ว่าจะ${toggleText}สำหรับชุด "${record.name}"?`,
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          await UpdateCostumeIsRentable(record.id, nextValue);
          message.success(`เปลี่ยนสถานะเป็น "${toggleText}" สำเร็จ`);
          queryClient.invalidateQueries({ queryKey: ["costumes"] });
        } catch (err) {
          console.error("เกิดข้อผิดพลาด:", err);
          toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
        }
      },
    });
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "ยืนยันการลบชุด",
      content: "คุณแน่ใจที่จะลบชุดนี้หรือไม่?",
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          await DeleteCostume(id);
          toast.success("ลบชุดสำเร็จ!");
          queryClient.invalidateQueries({ queryKey: ["costumes"] });
        } catch (error) {
          console.error("❌ เกิดข้อผิดพลาด:", error);
          toast.error("เกิดข้อผิดพลาดในการลบชุด");
        }
      },
    });
  };

  return {
    handleToggleRentableStatus,
    confirmDelete,
  };
};

export default useCostumeActions;
