import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3002"),
  withCredentials: true,
});

export default apiClient;
