import { HTTP_PORT, OAUTH2_PORT } from "@/hooks/useData";

export const GOOGLE_AUTH_URL =
  HTTP_PORT + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_PORT;
export const FACEBOOK_AUTH_URL =
  HTTP_PORT + "/oauth2/authorize/facebook?redirect_uri=" + OAUTH2_PORT;
