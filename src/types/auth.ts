export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id_user: number;
    nama_user: string;
    email: string;
  };
}

export interface RegisterPayload {
  nama_user: string;
  email: string;
  password: string;
}
