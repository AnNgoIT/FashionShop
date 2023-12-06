import { toast } from "react-toastify";

export function warningMessage(message: string) {
  toast(message, {
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

export function errorMessage(message: string) {
  toast(message, {
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

export function successMessage(message: string) {
  toast(message, {
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
