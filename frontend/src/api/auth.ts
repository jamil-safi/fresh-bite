import { apiClient } from "./client";
import { User } from "../types";

export interface AuthResponse {
  token: string;
  user: User;
}

export async function signupRequest(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/signup", payload);
  return data;
}

export async function loginRequest(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function meRequest(): Promise<{ user: User }> {
  const { data } = await apiClient.get<{ user: User }>("/auth/me");
  return data;
}
