import axios from 'axios';

export const appAxios = axios.create({
  baseURL: '/',
  withCredentials: true,
});

export default appAxios;
