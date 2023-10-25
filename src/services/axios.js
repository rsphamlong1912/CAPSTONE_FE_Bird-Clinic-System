import axios from "axios";

export const api = axios.create({
  baseURL: "https://clinicsystem.io.vn",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});