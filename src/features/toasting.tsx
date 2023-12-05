import { toast } from "react-toastify";

export function requireLogin() {
  setTimeout(
    () =>
      toast("Vui lòng đăng nhập", {
        position: "top-right",
        type: "warning",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }),
    500
  );
}
export function maxQuanity(quantity: number) {
  toast("Bạn chỉ được chọn tối đa " + quantity, {
    position: "top-right",
    type: "warning",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

export function noCartItemSelected() {
  toast("Bạn chưa chọn sản phẩm nào", {
    position: "top-right",
    type: "warning",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

export function noAddressAdded() {
  toast("Vui lòng chọn địa chỉ nhận hàng", {
    position: "top-right",
    type: "warning",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

export function deleteSuccess() {
  toast("Xóa thành công", {
    position: "top-right",
    type: "success",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}

export function loginSuccess() {
  toast("Đăng nhập thành công", {
    position: "top-right",
    type: "success",
    autoClose: 500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
}
