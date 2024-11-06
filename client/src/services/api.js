import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: "http://127.0.0.1:4000/api/", // this is the backend URL
});

// Add a request interceptor to include the Authorization header if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
