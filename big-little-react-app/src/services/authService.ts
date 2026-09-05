export type UserRole = "admin" | "user" | "garrick";

export interface AuthUser {
  userID: number;
  username: string;
  role: UserRole;
}

interface LoginResponse {
  success: boolean;
  user: AuthUser;
  message?: string;
}

const AUTH_USER_KEY = "big-little-auth-user";

export async function login(username: string, password: string): Promise<AuthUser> {
  const response = await fetch("http://18.188.158.238:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const result = (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to log in.");
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user));
  return result.user;
}

export function getCurrentUser(): AuthUser | null {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}
