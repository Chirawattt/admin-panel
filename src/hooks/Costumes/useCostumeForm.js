// hooks/useCostumeForm.js
import { useState } from "react";

const useCostumeForm = (form) => {
  const [costumeState, setCostumeState] = useState({
    isModalOpen: false,
    selectedImage: null,
    previewImage: null,
    editCostume: null,
    isChange: false,
  });

  const openModal = (costume = null) => {
    if (costume) {
      form.setFieldsValue({
        name: costume.name,
        price: costume.price,
        category: costume.category.toString(),
        age_group: costume.age_group,
      });
      setCostumeState({
        isModalOpen: true,
        selectedImage: null,
        previewImage: costume.image_path,
        editCostume: costume,
        isChange: false,
      });
    } else {
      form.resetFields();
      setCostumeState({
        isModalOpen: true,
        selectedImage: null,
        previewImage: null,
        editCostume: null,
        isChange: false,
      });
    }
  };

  const resetForm = () => {
    setCostumeState({
      isModalOpen: false,
      selectedImage: null,
      previewImage: null,
      editCostume: null,
      isChange: false,
    });
    form.resetFields();
  };

  const handleImageChange = (info) => {
    const file = info.file;
    setCostumeState((prev) => ({
      ...prev,
      selectedImage: file,
      previewImage: URL.createObjectURL(file),
      isChange: true,
    }));
  };

  const handleFormChange = () => {
    setCostumeState((prev) => ({ ...prev, isChange: true }));
  };

  return {
    costumeState,
    setCostumeState,
    openModal,
    resetForm,
    handleImageChange,
    handleFormChange,
  };
};

export default useCostumeForm;
