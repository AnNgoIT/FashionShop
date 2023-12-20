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
      `${process.env.NEXT_PUBLIC_API_URL}` + url,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};

    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const patchData = async (
  url: string,
  accessToken: string,
  payload: any,
  contentType: string = "application/json"
) => {
  const config: any = {
    headers: {
      "Content-Type": contentType,
      // "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}` + url,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const putData = async (
  url: string,
  accessToken: string,
  payload: any
) => {
  const config: any = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}` + url,
      payload,
      config
    );
    const data = res && res.data ? res.data : {};
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const getDataAdmin = async (url: string, accessToken: string) => {
  const config: any = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}` + url,
      config
    );
    const data = res && res.data ? res.data : {};

    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
