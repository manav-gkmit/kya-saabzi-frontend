import apiClient from "./axios";

// Dishes
export const addDish = (dishData) => {
  return apiClient.post("/dishes/", dishData);
};

export const searchDishes = (q) => {
  return apiClient.get('/dishes/search', { params: { q } });
};

// Cooklogs
export const getMyCooklogs = () => {
  return apiClient.get("/cooklogs/");
};

export const deleteCooklog = (cooklogId) => {
  return apiClient.delete(`/cooklogs/${cooklogId}`);
};

// Households
export const getMyHousehold = () => {
  return apiClient.get("/households/me");
};

export const updateMyHousehold = (data) => {
  return apiClient.patch("/households/me", data);
};

export const getHouseholdMembers = () => {
  return apiClient.get("/households/me/members");
};

export const joinHousehold = (inviteCode) => {
  return apiClient.post("/households/join", { invite_code: inviteCode });
};

// Recommendations
export const getRecommendations = () => {
  return apiClient.get("/recommend/");
};
