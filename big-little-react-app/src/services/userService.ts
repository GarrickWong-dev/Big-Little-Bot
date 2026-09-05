export type UserRole = "admin" | "user" | "garrick";

export interface CreateUserInput {
  username: string;
  password: string;
  role: UserRole;
}

export interface User {
  username: string;
  role: UserRole;
  userID: number;
}

interface CreateUserResponse {
  success: boolean;
  user: User;
  message?: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await fetch("/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = (await response.json()) as CreateUserResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to create user.");
  }

  return result.user;
}
