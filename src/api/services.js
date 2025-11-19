import apiClient from "./axios";

// Dishes
export const addDish = (dishData) => {
  return apiClient.post("/dishes/", dishData);
};

// Cooklogs
export const getMyCooklogs = () => {
  return apiClient.get("/cooklogs/");
};

export const deleteCooklog = (cooklogId) => {
  return apiClient.delete(`/cooklogs/${cooklogId}`);
};

// Recommendations
export const getRecommendations = () => {
  return apiClient.get("/recommend/");
};
