import api from "./axiosConfig";

export const FetchCostumes = async () => {
  const response = await api.get("/costumes");
  return response.data.map((costume) => ({
    ...costume,
    image_name: costume.image_path
      .split("/")
      .pop()
      .split("-")
      .slice(1)
      .join(""),
    image_path: `http://localhost:5000/${costume.image_path}`,
  }));
};

export const AddCostume = async (costumeData) => {
  const response = await api.post("/costumes", costumeData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const UpdateCostume = async (id, costumeData) => {
  const response = await api.put(`/costumes/${id}`, costumeData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const FetchReviewImages = async (id) => {
  const response = await api.get(`/costumes/${id}/reviewImages`);
  return response.data.map((review) => ({
    ...review,
    image_path: `http://localhost:5000/${review.image_path}`,
  }));
};

export const DeleteCostume = async (id) => {
  await api.delete(`/costumes/${id}`);
};
