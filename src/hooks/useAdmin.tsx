import axios from "axios";

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
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_DEVELOPMENT_API}` + url,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};

    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
