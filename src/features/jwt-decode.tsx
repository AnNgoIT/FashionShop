import jwt from "jsonwebtoken";

export const decodeToken = (token: string): Date | null => {
  try {
    const decoded: any = jwt.decode(token, { complete: true }); // Giải mã token
    if (decoded && decoded.payload && decoded.payload.exp) {
      const expirationTimeInSeconds = decoded.payload.exp;
      const expirationDate = new Date(expirationTimeInSeconds * 1000); // Chuyển đổi thành mili giây
      return expirationDate;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwt.decode(token); // Giải mã token
    if (decoded && decoded.exp) {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000); // Thời gian hiện tại tính bằng giây từ Epoch
      return decoded.exp < currentTimeInSeconds; // So sánh thời gian hết hạn với thời gian hiện tại
    }
    return true; // Trả về true nếu không tìm thấy thông tin hết hạn trong token
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Trả về true nếu có lỗi khi giải mã token
  }
};
