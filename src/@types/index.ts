export interface RegisterFormValues {
  email: string;
}

export interface VerifyFormValues {
    fullName: string;
    password: string;
    token: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  birthDate?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}