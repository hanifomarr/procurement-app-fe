export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}
