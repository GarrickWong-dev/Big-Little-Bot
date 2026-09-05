interface ContestNameResponse {
  success: boolean;
  contestName: string;
  message?: string;
}

export async function getContestName(contestID: number): Promise<string> {
  const response = await fetch(`/contest/${contestID}/name`);
  const result = (await response.json()) as ContestNameResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load contest name.");
  }

  return result.contestName;
}
