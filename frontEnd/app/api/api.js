import config from "@/postcss.config.mjs";
import axios from "axios";

export const server = await axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

server.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  config.headers.Authorization = token ? `Bearer ${token}` : null;
  return config;
});
