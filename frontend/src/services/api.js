import axios from "axios";
import { getToken } from "./session";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://homefeast-backend.onrender.com/api"
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
