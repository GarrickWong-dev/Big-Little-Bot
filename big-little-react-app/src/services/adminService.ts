export interface CreateContestInput {
  contestName: string;
  maxSubs: number | null;
  adminID: number;
}

export interface Contest {
  contestID: number;
  contestName: string;
  maxSubs: number | null;
}

interface CreateContestResponse {
  success: boolean;
  contest: Contest;
  message?: string;
}

export async function createContest(
  input: CreateContestInput,
): Promise<Contest> {
  const response = await fetch("/admin/contests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const result = (await response.json()) as CreateContestResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to create contest.");
  }

  return result.contest;
}
