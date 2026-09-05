interface ContestNameResponse {
  success: boolean;
  contestName: string;
  message?: string;
}

interface ContestActionResponse {
  success: boolean;
  result: unknown;
  message?: string;
}

interface UserContestsResponse {
  success: boolean;
  contests: number[];
  message?: string;
}

export interface LeaderboardEntry {
  userID: number;
  teamName: string;
  pointsTotal: number;
  place: number;
}

interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
  message?: string;
}

export async function getContestName(contestID: number): Promise<string> {
  const response = await fetch(`http://18.188.158.238:3000/contest/${contestID}/name`);
  const result = (await response.json()) as ContestNameResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load contest name.");
  }

  return result.contestName;
}

export async function getContestsByUser(userID: number): Promise<number[]> {
  const response = await fetch(`http://18.188.158.238:3000/contest/user/${userID}`);
  const result = (await response.json()) as UserContestsResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load your contests.");
  }

  return result.contests;
}

export async function getLeaderboard(
  contestID: number,
): Promise<LeaderboardEntry[]> {
  const response = await fetch(`http://18.188.158.238:3000/contest/${contestID}/leaderboard`);
  const result = (await response.json()) as LeaderboardResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load leaderboard.");
  }

  return result.leaderboard;
}

async function sendContestAction(
  url: string,
  options: RequestInit,
  errorMessage: string,
): Promise<void> {
  const response = await fetch(url, options);
  const result = (await response.json()) as ContestActionResponse;

  if (!response.ok) {
    throw new Error(result.message || errorMessage);
  }
}

export async function addUserToContest(
  contestID: number,
  userID: number,
): Promise<void> {
  await sendContestAction(
    "http://18.188.158.238:3000/admin/contests/addTeam",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contestID, userID }),
    },
    "Unable to add user to contest.",
  );
}

export async function updateContestMaxSubs(
  contestID: number,
  maxSubs: number | null,
): Promise<void> {
  await sendContestAction(
    `http://18.188.158.238:3000/admin/contests/${contestID}/maxsubs`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maxSubs }),
    },
    "Unable to update contest submission limit.",
  );
}

export async function activateContest(contestID: number): Promise<void> {
  await sendContestAction(
    `http://18.188.158.238:3000/admin/contests/${contestID}/activate`,
    { method: "PUT" },
    "Unable to activate contest.",
  );
}

export async function deactivateContest(contestID: number): Promise<void> {
  await sendContestAction(
    `http://18.188.158.238:3000/admin/contests/${contestID}/deactivate`,
    { method: "PUT" },
    "Unable to deactivate contest.",
  );
}
