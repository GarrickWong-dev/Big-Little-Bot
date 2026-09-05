export interface AdminUserAssociation {
  userID: number;
  adminID: number;
}

interface UsersByAdminResponse {
  success: boolean;
  users: AdminUserAssociation[];
  message?: string;
}

export async function getUsersByAdmin(
  adminID: number,
): Promise<AdminUserAssociation[]> {
  const response = await fetch(`http://18.188.158.238:3000/uata/users/${adminID}`);
  const result = (await response.json()) as UsersByAdminResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load users for admin.");
  }

  return result.users;
}
