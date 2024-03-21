import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.HOST_API || "",
});

console.log("axiosInstance", axiosInstance);

export default axiosInstance;
