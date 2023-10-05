export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  login: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  register: {
    user: User;
    token: string;
  };
}

export interface AlertInput {
  active: boolean;
  alert: {
    severity: "success" | "info" | "warning" | "error";
    message?: string | "alert";
    title?: string | null;
    onClose?: boolean;
    timeout?: number;
    variant?: "outlined" | "filled" | "standard";
  };
}
