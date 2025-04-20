import axios from "axios";

export const apiGetPrice = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/bnb-price");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch BNB price");
  }
};
