import { useParams } from "react-router-dom";
import { Upload, Button, List, message } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchImages = async (costumeId) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/costumes/${costumeId}/images`
  );
  return data;
};

const Images = () => {
  const { id: costumeId } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(["images", costumeId], () =>
    fetchImages(costumeId)
  );

  const uploadImage = useMutation(
    async (file) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("costume_id", costumeId);
      await axios.post("http://localhost:5000/api/images/upload", formData);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["images", costumeId]),
    }
  );

  const deleteImage = useMutation(
    async (imageId) => {
      await axios.delete(`http://localhost:5000/api/images/${imageId}`);
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["images", costumeId]),
    }
  );

  return (
    <div>
      <h2>จัดการรูปภาพ</h2>
      <Upload
        customRequest={({ file, onSuccess }) => {
          uploadImage.mutate(file, {
            onSuccess: () => {
              onSuccess();
              message.success("อัปโหลดสำเร็จ");
            },
          });
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>อัปโหลดรูป</Button>
      </Upload>

      <List
        dataSource={data}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item
            actions={[
              <DeleteOutlined
                onClick={() => deleteImage.mutate(item.id)}
                style={{ color: "red" }}
              />,
            ]}
          >
            <img
              src={`http://localhost:5000${item.image_path}`}
              alt="costume"
              style={{ width: 100, borderRadius: 8 }}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Images;
