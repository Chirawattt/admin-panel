import React, { useState } from "react";
import { Modal, Tabs, Button, Typography, Space, Alert, Checkbox } from "antd";
import {
  FileOutlined,
  LockFilled,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const TermsModal = ({ visible, onAccept, onCancel }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCheckboxChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <FileOutlined /> เงื่อนไขการใช้งาน
        </span>
      ),
      children: (
        <div style={{ height: "400px", overflowY: "auto", padding: "0 10px" }}>
          <Title level={4}>
            เงื่อนไขการใช้งานระบบจัดการร้าน Moso-Yodia Cafe&Bar
          </Title>
          <Paragraph>
            <Text strong>1. การยอมรับเงื่อนไขการใช้งาน</Text>
            <br />
            การเข้าใช้งานระบบจัดการร้าน Moso-Yodia Cafe&Bar ("ระบบ")
            ถือว่าท่านได้อ่าน เข้าใจ และยอมรับเงื่อนไขการใช้งานทั้งหมดนี้แล้ว
            หากท่านไม่ยอมรับเงื่อนไขข้อใดข้อหนึ่ง ท่านไม่ควรใช้งานระบบนี้
          </Paragraph>

          <Paragraph>
            <Text strong>2. การอนุญาตให้ใช้งาน</Text>
            <br />
            ระบบนี้เป็นทรัพย์สินของ Moso-Yodia Cafe&Bar
            และอนุญาตให้พนักงานและผู้มีสิทธิ์เท่านั้นที่สามารถเข้าใช้งานได้
            การใช้งานใดๆ
            นอกเหนือจากที่ได้รับอนุญาตถือเป็นการละเมิดลิขสิทธิ์และอาจมีความผิดตามกฎหมาย
          </Paragraph>

          <Paragraph>
            <Text strong>3. บัญชีผู้ใช้และความปลอดภัย</Text>
            <br />
            ท่านมีหน้าที่รักษาความลับของรหัสผ่านและบัญชีผู้ใช้ของท่าน
            ท่านต้องรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของท่าน
            หากพบการใช้งานที่ไม่ได้รับอนุญาต ท่านต้องแจ้งให้ผู้ดูแลระบบทราบทันที
          </Paragraph>

          <Paragraph>
            <Text strong>4. ข้อมูลและการใช้งาน</Text>
            <br />
            - ท่านต้องใช้ข้อมูลในระบบด้วยความระมัดระวังและเป็นความลับ
            <br />
            - ห้ามเผยแพร่ข้อมูลสำคัญของร้านหรือข้อมูลลูกค้าโดยไม่ได้รับอนุญาต
            <br />- ข้อมูลทั้งหมดในระบบต้องถูกใช้เพื่อวัตถุประสงค์ทางธุรกิจของ
            Moso-Yodia Cafe&Bar เท่านั้น
          </Paragraph>

          <Paragraph>
            <Text strong>5. การสำรองข้อมูล</Text>
            <br />
            Moso-Yodia Cafe&Bar จะพยายามสำรองข้อมูลอย่างสม่ำเสมอ
            แต่ไม่รับประกันความสมบูรณ์ของข้อมูลหากเกิดความเสียหาย
            ผู้ใช้งานควรตรวจสอบข้อมูลสำคัญและรายงานความผิดปกติให้ผู้ดูแลระบบทราบทันที
          </Paragraph>

          <Paragraph>
            <Text strong>6. การแก้ไขและปรับปรุงระบบ</Text>
            <br />
            Moso-Yodia Cafe&Bar สงวนสิทธิ์ในการปรับปรุง เปลี่ยนแปลง
            หรือระงับการให้บริการระบบบางส่วนหรือทั้งหมดโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
            หากมีการเปลี่ยนแปลงเงื่อนไขการใช้งาน จะมีการแจ้งให้ผู้ใช้งานทราบ
          </Paragraph>

          <Paragraph>
            <Text strong>7. การยกเลิกสิทธิ์การใช้งาน</Text>
            <br />
            Moso-Yodia Cafe&Bar
            มีสิทธิ์ในการยกเลิกหรือระงับสิทธิ์การใช้งานของท่านหากพบว่ามีการละเมิดเงื่อนไขการใช้งานหรือกฎหมายที่เกี่ยวข้อง
          </Paragraph>

          <Paragraph>
            <Text strong>8. กฎหมายที่บังคับใช้</Text>
            <br />
            เงื่อนไขการใช้งานนี้อยู่ภายใต้กฎหมายของประเทศไทย การโต้แย้งใดๆ
            ที่เกิดขึ้นจะอยู่ภายใต้เขตอำนาจศาลประเทศไทย
          </Paragraph>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <LockFilled /> นโยบายความเป็นส่วนตัว
        </span>
      ),
      children: (
        <div style={{ height: "400px", overflowY: "auto", padding: "0 10px" }}>
          <Title level={4}>นโยบายความเป็นส่วนตัว Moso-Yodia Cafe&Bar</Title>
          <Paragraph>
            <Text strong>1. ข้อมูลที่เราเก็บรวบรวม</Text>
            <br />
            ระบบของเราเก็บรวบรวมข้อมูลเพียงเล็กน้อยเพื่อการดำเนินงาน:
            <br />
            - ข้อมูลพื้นฐานของผู้ใช้งาน: ชื่อ, อีเมล, ตำแหน่งงาน
            <br />
            - ข้อมูลการเข้าสู่ระบบ: ชื่อผู้ใช้และรหัสผ่านที่เข้ารหัส
            <br />- ข้อมูลสถานะชุด: ประเภทชุด สถานะการใช้งาน และข้อมูลชุดต่างๆ
          </Paragraph>

          <Paragraph>
            <Text strong>2. วัตถุประสงค์ในการเก็บข้อมูล</Text>
            <br />
            เราเก็บรวบรวมข้อมูลเพื่อ:
            <br />
            - จัดการระบบบริหารร้านอย่างมีประสิทธิภาพ
            <br />
            - ตรวจสอบสิทธิ์การเข้าถึงระบบและความปลอดภัย
            <br />- จัดการสถานะชุดและข้อมูลอื่นๆ ที่เกี่ยวข้องกับการบริหารร้าน
          </Paragraph>

          <Paragraph>
            <Text strong>3. การเปิดเผยข้อมูล</Text>
            <br />
            เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านให้กับบุคคลภายนอก ยกเว้น:
            <br />
            - เมื่อได้รับความยินยอมจากท่าน
            <br />- เมื่อมีความจำเป็นต้องปฏิบัติตามกฎหมาย
          </Paragraph>

          <Paragraph>
            <Text strong>4. การรักษาความปลอดภัยของข้อมูล</Text>
            <br />
            เรามีมาตรการรักษาความปลอดภัยทางเทคนิคพื้นฐาน อย่างไรก็ตาม
            ไม่มีระบบใดที่ปลอดภัย 100%
            ท่านควรใช้ความระมัดระวังในการใช้งานระบบและรักษารหัสผ่านให้ปลอดภัย
          </Paragraph>

          <Paragraph>
            <Text strong>5. สิทธิ์ของท่าน</Text>
            <br />
            ท่านมีสิทธิ์:
            <br />
            - ขอเข้าถึงข้อมูลส่วนบุคคลของท่าน
            <br />
            - ขอให้แก้ไขข้อมูลที่ไม่ถูกต้อง
            <br />- ขอให้ลบข้อมูลส่วนบุคคลของท่าน (หากพ้นจากการเป็นพนักงาน)
          </Paragraph>

          <Paragraph>
            <Text strong>6. คุกกี้และการติดตาม</Text>
            <br />
            ระบบจัดการร้านไม่มีการใช้คุกกี้หรือเทคโนโลยีการติดตามใดๆ
            นอกเหนือจากการใช้ localStorage
            เพื่อจัดเก็บข้อมูลการเข้าสู่ระบบและการจดจำชื่อผู้ใช้เท่านั้น
          </Paragraph>

          <Paragraph>
            <Text strong>7. การเปลี่ยนแปลงนโยบาย</Text>
            <br />
            เราอาจปรับปรุงนโยบายความเป็นส่วนตัวเป็นครั้งคราว
            การเปลี่ยนแปลงจะมีผลบังคับใช้เมื่อเราเผยแพร่นโยบายที่แก้ไขในระบบ
          </Paragraph>

          <Paragraph>
            <Text strong>8. ติดต่อเรา</Text>
            <br />
            หากท่านมีคำถามหรือข้อกังวลเกี่ยวกับนโยบายความเป็นส่วนตัว
            โปรดติดต่อผู้ดูแลระบบหรือเจ้าของร้าน Moso-Yodia Cafe&Bar
          </Paragraph>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <InfoCircleOutlined />
          <span>เงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว</span>
        </Space>
      }
      open={visible}
      width={700}
      centered
      maskClosable={false}
      closable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          ไม่ยอมรับ
        </Button>,
        <Button
          key="accept"
          type="primary"
          disabled={!acceptedTerms}
          onClick={onAccept}
        >
          ยอมรับ
        </Button>,
      ]}
    >
      <Alert
        message="สำคัญ: กรุณาอ่านข้อกำหนดให้ครบถ้วนก่อนการใช้งานระบบ"
        description="การใช้งานระบบถือว่าท่านได้ยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวแล้ว"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />

      <div style={{ marginTop: 16 }}>
        <Checkbox onChange={handleCheckboxChange} checked={acceptedTerms}>
          ข้าพเจ้าได้อ่านและยอมรับ{" "}
          <Button
            type="link"
            size="small"
            onClick={() => setActiveTab("1")}
            style={{ padding: "0 4px" }}
          >
            เงื่อนไขการใช้งาน
          </Button>{" "}
          และ{" "}
          <Button
            type="link"
            size="small"
            onClick={() => setActiveTab("2")}
            style={{ padding: "0 4px" }}
          >
            นโยบายความเป็นส่วนตัว
          </Button>{" "}
          ของ Moso-Yodia Cafe&Bar
        </Checkbox>
      </div>
    </Modal>
  );
};

export default TermsModal;
