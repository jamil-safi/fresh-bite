import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  // Fail fast rather than hanging indefinitely so retry/"waking up" logic
  // can kick in promptly when the backend is cold-starting (Render free tier).
  timeout: 8000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("freshbites_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
