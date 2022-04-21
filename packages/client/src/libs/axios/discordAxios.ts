import axios from "axios";

export const discordAxios = axios.create({
  baseURL: "https://discordapp.com/api/v9",
});

export default discordAxios;
