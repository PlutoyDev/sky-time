import axios from "axios";

export const authAxios = axios.create({
  baseURL: "/",
  withCredentials: true,
});

export default authAxios;
