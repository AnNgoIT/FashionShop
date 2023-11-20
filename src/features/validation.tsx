import { Account } from "./types";

// Hàm validate
const validateRegisterForm = (account: Account) => {
  const errors: Account = {
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  // Kiểm tra fullname
  if (!account.fullname) {
    errors.fullname = "Enter your name";
  }

  // Kiểm tra email
  if (!account.email) {
    errors.email = "Enter your email";
  } else if (!/\S+@\S+\.\S+/.test(account.email)) {
    errors.email = "Your email not valid";
  }

  // Kiểm tra phone
  if (!account.phone) {
    errors.phone = "Enter your phone number";
  } else if (!/^\d{10,11}$/.test(account.phone)) {
    errors.phone = "Phone number not valid";
  }

  // Kiểm tra password
  if (!account.password) {
    errors.password = "Enter your password";
  } else {
    // Kiểm tra độ dài
    if (account.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (account.password.length > 32) {
      errors.password = "Password must be max 32 characters long";
    }
    // Kiểm tra chứa ít nhất một chữ cái viết hoa
    if (!/[A-Z]/.test(account.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    }

    // Kiểm tra chứa ít nhất một chữ cái viết thường
    if (!/[a-z]/.test(account.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    }

    // Kiểm tra chứa ít nhất một số
    if (!/\d/.test(account.password)) {
      errors.password = "Password must contain at least one number";
    }

    // Kiểm tra chứa ít nhất một ký tự đặc biệt
    if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(account.password)) {
      errors.password = "Password must contain at least one special character";
    }
  }

  // Kiểm tra confirmPassword
  if (!account.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (account.confirmPassword !== account.password) {
    errors.confirmPassword = "Wrong confirm password";
  }

  return errors;
};

export default validateRegisterForm;
