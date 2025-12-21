export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
  userId: number; //TS number = Java Long
  username: string;
  fullName: string;
  role: string;
  issuedAt: string; //Java Date = TS String (Viene como texto)
  expiredAt: string;
}
