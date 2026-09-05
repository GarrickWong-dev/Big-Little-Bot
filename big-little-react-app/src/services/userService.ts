export type UserRole = "admin" | "user" | "garrick";

export interface CreateUserInput {
  username: string;
  password: string;
  role: UserRole;
  adminID: number;
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

interface TeamNameResponse {
  success: boolean;
  teamName: string;
  message?: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await fetch("http://18.188.158.238:3000/admin/users", {
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

export async function getTeamName(userID: number): Promise<string> {
  const response = await fetch(`http://18.188.158.238:3000/user/${userID}/team-name`);
  const result = (await response.json()) as TeamNameResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load team name.");
  }

  return result.teamName;
}
