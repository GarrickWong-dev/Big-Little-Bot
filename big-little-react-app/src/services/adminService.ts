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

interface OwnedContestsResponse {
  success: boolean;
  contests: number[];
  message?: string;
}

export async function createContest(
  input: CreateContestInput,
): Promise<Contest> {
  const response = await fetch("http://18.188.158.238:3000/admin/contests", {
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

export async function getOwnedContestIds(adminID: number): Promise<number[]> {
  const response = await fetch(`http://18.188.158.238:3000/admin/contests/${adminID}`);
  const result = (await response.json()) as OwnedContestsResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load owned contests.");
  }

  return result.contests;
}
