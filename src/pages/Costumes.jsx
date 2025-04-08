import { Layout, Form, Grid, message } from "antd";
import Navbar from "../components/shared/Navbar";
import CostumeFormModal from "../components/Costumes/CostumeFormModal";
import useCostumeForm from "../hooks/Costumes/useCostumeForm";
import useCostumeData from "../hooks/Costumes/useCostumeData";
import useCostumeActions from "../hooks/Costumes/useCostumeActions";
import useFormSubmission from "../hooks/Costumes/useFormSubmission";
import PageHeader from "../components/shared/PageHeader";
import SearchBar from "../components/Costumes/SearchBar";
import AdvancedSearchFilter from "../components/Costumes/AdvancedSearchFilter";
import CostumeTable from "../components/Costumes/CostumeTable";
import { useState } from "react";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const Costumes = () => {
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const [refreshing, setRefreshing] = useState(false);

  // Custom hooks
  const {
    costumeState,
    setCostumeState,
    openModal,
    resetForm,
    handleImageChange,
    handleFormChange,
  } = useCostumeForm(form);

  const {
    paginatedData,
    pagination,
    isLoading,
    refetch,
    handleTableChange,
    handleFilterChange,
    queryClient,
  } = useCostumeData();

  const { handleToggleRentableStatus, confirmDelete } =
    useCostumeActions(queryClient);

  const { onFinish } = useFormSubmission(queryClient, resetForm);

  // ฟังก์ชันจัดการการส่งฟอร์ม wrapper
  const handleFinish = (values) => {
    onFinish(values, costumeState);
  };

  // ฟังก์ชันสำหรับการรีเฟรชที่ชัดเจนและแสดง feedback
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      message.success("รีเฟรชข้อมูลเรียบร้อย");
    } catch (error) {
      console.error("Error refreshing data:", error);
      message.error("เกิดข้อผิดพลาดในการรีเฟรชข้อมูล");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Layout>
      {/* Navbar ด้านบน */}
      <Navbar />

      {/* Container ครอบเนื้อหา */}
      <Content
        style={{
          margin: screens.xs ? "10px" : "20px auto",
          maxWidth: screens.lg ? 900 : "100%",
          padding: screens.xs ? 10 : 20,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* ส่วนหัวของหน้า */}
        <PageHeader
          title="จัดการชุด"
          onRefresh={handleRefresh}
          loading={isLoading || refreshing}
          onAddNew={() => openModal(null)}
        />

        {/* ค้นหาและกรองแบบพื้นฐาน */}
        <SearchBar onSearch={handleFilterChange} />

        {/* ค้นหาขั้นสูง */}
        <AdvancedSearchFilter onFilterChange={handleFilterChange} />

        {/* ตารางแสดงรายการชุด */}
        <CostumeTable
          dataSource={paginatedData}
          loading={isLoading}
          pagination={pagination}
          onChange={handleTableChange}
          onEdit={openModal}
          onDelete={confirmDelete}
          onToggleStatus={handleToggleRentableStatus}
        />

        {/* Modal เพิ่ม/แก้ไขชุด */}
        <CostumeFormModal
          open={costumeState.isModalOpen}
          onClose={() =>
            setCostumeState({ ...costumeState, isModalOpen: false })
          }
          onSubmit={handleFinish}
          form={form}
          isLoading={isLoading}
          costumeState={costumeState}
          handleImageChange={handleImageChange}
          handleFormChange={handleFormChange}
          isMobile={screens.xs}
        />
      </Content>
    </Layout>
  );
};

export default Costumes;
