import axios from "axios";
import { HTTP_PORT } from "./useData";

export const createData = async (
  url: string,
  accessToken: string,
  payload: any,
  contentType: string = "multipart/form-data"
) => {
  const config: any = {
    headers: {
      "Content-Type": contentType,
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.post(`${HTTP_PORT}` + url, payload, config);
    const data = res && res.data ? res.data : {};

    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
