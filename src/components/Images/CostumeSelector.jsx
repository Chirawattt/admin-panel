import React, { useMemo } from "react";
import { Select, Divider, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option, OptGroup } = Select;

/**
 * Component สำหรับแสดงตัวเลือกชุด
 */
const CostumeSelector = ({
  costumes,
  selectedCostumeId,
  onChange,
  loading,
}) => {
  // จัดกลุ่มชุดตามประเภท
  const groupedCostumes = useMemo(() => {
    return [
      {
        label: "กิโมโน",
        value: 0,
        costumes: costumes.filter((c) => c.category === 0),
      },
      {
        label: "ยูกาตะ",
        value: 1,
        costumes: costumes.filter((c) => c.category === 1),
      },
      {
        label: "คอสเพลย์",
        value: 2,
        costumes: costumes.filter((c) => c.category === 2),
      },
    ];
  }, [costumes]);

  return (
    <div>
      <Text strong>เลือกชุด</Text>
      <Select
        placeholder="เลือกชุด"
        onChange={onChange}
        style={{ width: "100%", marginTop: 8 }}
        allowClear
        showSearch
        optionFilterProp="label"
        loading={loading}
        dropdownRender={(menu) => (
          <>
            <div style={{ padding: "8px", textAlign: "center" }}>
              <SearchOutlined /> ค้นหาชุด
            </div>
            <Divider style={{ margin: "4px 0" }} />
            {menu}
          </>
        )}
        value={selectedCostumeId}
      >
        {groupedCostumes.map((group) => (
          <OptGroup key={group.value} label={group.label}>
            {group.costumes.map((c) => (
              <Option key={c.id} value={c.id} label={c.name}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <img
                    src={c.image_path}
                    style={{
                      width: 30,
                      height: 30,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                    alt={c.name}
                  />
                  <div>{c.name}</div>
                </div>
              </Option>
            ))}
          </OptGroup>
        ))}
      </Select>
    </div>
  );
};

export default CostumeSelector;
