// src/pages/CostumeStatus.jsx
import React from "react";
import { Layout, Typography, Grid } from "antd";
import Navbar from "../components/shared/Navbar";
import SearchFilter from "../components/shared/SearchFilter";
import CostumeGrid from "../components/shared/CostumeGrid";
import CostumeDetail from "../components/CostumeStatus/CostumeDetail";
import CostumeSummary from "../components/CostumeStatus/CostumeSummary";
import StatusHeaderButtons from "../components/CostumeStatus/StatusHeaderButtons";
import useCostumeStatus from "../hooks/CostumeStatus/useCostumeStatus";
import {
  getCategoryDisplay,
  getAgeGroupDisplay,
  getStatusDisplay,
  getStatusTag,
} from "../utils/formatters.jsx";

const { Content } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const CostumeStatus = () => {
  const screens = useBreakpoint();
  const {
    filterCostumes,
    statusCounts,
    filterState,
    selectedCostume,
    detailVisible,
    highlightedId,
    loading,
    fetchCostumes,
    handleFilterChange,
    handleStatusToggle,
    resetAllStatusToAvailable,
    showCostumeDetail,
    setDetailVisible,
  } = useCostumeStatus();

  return (
    <Layout>
      <Navbar />
      <Content
        style={{
          margin: screens.xs ? "10px" : "20px auto",
          maxWidth: screens.lg ? 1100 : "100%",
          padding: screens.xs ? 10 : 20,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* หัวข้อหน้าและปุ่ม */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: screens.xs ? "100%" : "auto",
              marginBottom: screens.xs ? 10 : 0,
            }}
          >
            <Title level={screens.xs ? 4 : 3}>จัดการสถานะชุด</Title>
          </div>
          <div style={{ textAlign: screens.xs ? "left" : "right" }}>
            <StatusHeaderButtons
              onRefresh={fetchCostumes}
              onResetAll={resetAllStatusToAvailable}
              loading={loading}
            />
          </div>
        </div>

        {/* ค้นหาและตัวกรอง */}
        <SearchFilter
          searchPlaceholder="ค้นหาชื่อชุด"
          onChange={handleFilterChange}
          showStatusButtons={true}
          showAdvanced={true}
          filterState={filterState}
          statusCounts={statusCounts}
          loading={loading}
        />

        {/* สรุปผลการค้นหา */}
        <CostumeSummary
          totalCostumes={filterCostumes.length}
          filterState={filterState}
          getCategoryDisplay={getCategoryDisplay}
          getAgeGroupDisplay={getAgeGroupDisplay}
          getStatusDisplay={getStatusDisplay}
        />

        {/* แสดงกริดชุด */}
        <CostumeGrid
          costumes={filterCostumes}
          loading={loading}
          selectedCostumeId={selectedCostume?.id}
          onSelect={showCostumeDetail}
          renderStatus={true}
          highlightedId={highlightedId}
          emptyText="ไม่พบชุดที่ตรงกับเงื่อนไข"
        />

        {/* โมดัลแสดงรายละเอียดชุด */}
        <CostumeDetail
          costume={selectedCostume}
          visible={detailVisible}
          onCancel={() => setDetailVisible(false)}
          onToggleStatus={handleStatusToggle}
          getStatusTag={getStatusTag}
          getCategoryDisplay={getCategoryDisplay}
          getAgeGroupDisplay={getAgeGroupDisplay}
        />
      </Content>
    </Layout>
  );
};

export default CostumeStatus;
