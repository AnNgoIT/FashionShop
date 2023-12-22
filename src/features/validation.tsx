import { ResetPassword } from "@/container/profile/reset-password-form";
import { Account, productItem } from "./types";
import { ProductItemError } from "@/container/admin/admin-product-item";

// Hàm validate
const validateCreateAccountForm = (account: Account) => {
  const errors: Account = {
    fullname: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  // Kiểm tra fullname
  if (!account.fullname) {
    errors.fullname = "Nhập tên của bạn";
  }

  // Kiểm tra email
  if (!account.email) {
    errors.email = "Nhập email của bạn";
  } else if (!/\S+@\S+\.\S+/.test(account.email)) {
    errors.email = "Email không chính xác, vui lòng nhập lại";
  }

  // Kiểm tra phone
  if (!account.phone) {
    errors.phone = "Nhập số điện thoại của bạn";
  } else if (!/^\d{10,11}$/.test(account.phone)) {
    errors.phone = "Số điện thoại không chính xác, vui lòng nhập lại";
  }
  if (account.address == "" || !account.address) {
    errors.address = "Vui lòng chọn thành phố cho người giao hàng";
  }

  // Kiểm tra password
  if (!account.password || account.password.length === 0) {
    errors.password = "Nhập mật khẩu của bạn";
  } else {
    // Kiểm tra độ dài
    if (account.password.length < 8) {
      errors.password = "Mật khẩu có độ dài tối thiểu 8 ký tự";
    }
    if (account.password.length > 32) {
      errors.password = "Mật khẩu chỉ được tối đa 32 ký tự";
    }
    // Kiểm tra chứa ít nhất một chữ cái viết hoa
    if (!/[A-Z]/.test(account.password)) {
      errors.password = "Mật khẩu phải chứa một ký tự hoa";
    }

    // Kiểm tra chứa ít nhất một chữ cái viết thường
    if (!/[a-z]/.test(account.password)) {
      errors.password = "Mật khẩu phải chứa một ký tự thường";
    }

    // Kiểm tra chứa ít nhất một số
    if (!/\d/.test(account.password)) {
      errors.password = "Mật khẩu phải chứa một ký tự số";
    }

    // Kiểm tra chứa ít nhất một ký tự đặc biệt
    if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(account.password)) {
      errors.password = "Mật khẩu phải chứa một ký tự đặc biệt";
    }
  }

  // Kiểm tra confirmPassword
  if (!account.confirmPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu của bạn";
  } else if (account.confirmPassword !== account.password) {
    errors.confirmPassword = "Xác nhận mật khẩu chưa chính xác";
  }

  return errors;
};

const validateChangePasswordForm = (userPassword: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const errors = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  if (!userPassword.newPassword) {
    errors.newPassword = "Nhập mật khẩu mới của bạn";
  } else {
    // Kiểm tra độ dài
    if (userPassword.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu mới có độ dài tối thiểu 8 ký tự";
    }
    if (userPassword.newPassword.length > 32) {
      errors.newPassword = "Mật khẩu mới chỉ được tối đa 32 ký tự";
    }
    // Kiểm tra chứa ít nhất một chữ cái viết hoa
    if (!/[A-Z]/.test(userPassword.newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa một ký tự hoa";
    }

    // Kiểm tra chứa ít nhất một chữ cái viết thường
    if (!/[a-z]/.test(userPassword.newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa một ký tự thường";
    }

    // Kiểm tra chứa ít nhất một số
    if (!/\d/.test(userPassword.newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa một ký tự số";
    }

    // Kiểm tra chứa ít nhất một ký tự đặc biệt
    if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(userPassword.newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa một ký tự đặc biệt";
    }
  }

  // Kiểm tra confirmPassword
  if (!userPassword.confirmPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu mới";
  } else if (userPassword.confirmPassword !== userPassword.newPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu mới chưa chính xác";
  }

  return errors;
};

const validateResetPasswordForm = (userPassword: ResetPassword) => {
  const errors: ResetPassword = {
    email: userPassword.email,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  };
  if (userPassword.otp.length > 6) {
    errors.otp = "OTP chưa đúng";
  } else if (!userPassword.otp) {
    errors.otp = "Nhập OTP của bạn";
  }

  if (!userPassword.newPassword) {
    errors.newPassword = "Nhập mật khẩu mới của bạn";
  } else {
    // Kiểm tra độ dài
    if (userPassword.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu mới có độ dài tối thiểu 8 ký tự";
    }
    if (userPassword.newPassword.length > 32) {
      errors.newPassword = "Mật khẩu mới chỉ được tối đa 32 ký tự";
    }
    // Kiểm tra chứa ít nhất một chữ cái viết hoa
    if (!/[A-Z]/.test(userPassword.newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa một ký tự hoa";
    }

    // Kiểm tra chứa ít nhất một chữ cái viết thường
    if (!/[a-z]/.test(userPassword.newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa một ký tự thường";
    }

    // Kiểm tra chứa ít nhất một số
    if (!/\d/.test(userPassword.newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa một ký tự số";
    }

    // Kiểm tra chứa ít nhất một ký tự đặc biệt
    if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/.test(userPassword.newPassword)) {
      errors.newPassword = "Mật khẩu mới phải chứa một ký tự đặc biệt";
    }
  }

  // Kiểm tra confirmPassword
  if (!userPassword.confirmPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu mới";
  } else if (userPassword.confirmPassword !== userPassword.newPassword) {
    errors.confirmPassword = "Xác nhận mật khẩu mới chưa chính xác";
  }

  return errors;
};

const validateProductItemForm = (validateValue: productItem) => {
  const errors: ProductItemError = {
    quantity: "",
    price: "",
  };
  if (validateValue.quantity <= 0) {
    errors.quantity = "Số lượng sản phẩm phải lớn hơn 0";
  } else if (validateValue.quantity <= validateValue.sold) {
    errors.quantity = "Số lượng sản phẩm phải lớn hơn hoặc bằng số đã bán ra";
  }
  if (validateValue.price <= 0) {
    errors.price = "Giá sản phẩm phải lớn hơn 0";
  }
  return errors;
};

export {
  validateChangePasswordForm,
  validateCreateAccountForm,
  validateProductItemForm,
  validateResetPasswordForm,
};
