export interface Submission {
  submissionID: number;
  title: string;
  userID: number;
  contestID: number;
  submissionDate: string;
  points: number;
  picturePath: string;
}

interface SubmissionsResponse {
  success: boolean;
  submissions: Submission[];
  message?: string;
}

interface DeleteSubmissionResponse {
  success: boolean;
  result: unknown;
  message?: string;
}

export async function getSubmissionsByContest(
  contestID: number,
): Promise<Submission[]> {
  const response = await fetch(`/subs/contest/${contestID}`);
  const result = (await response.json()) as SubmissionsResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load submissions.");
  }

  return result.submissions;
}

export async function deleteSubmission(submissionID: number): Promise<void> {
  const response = await fetch(`/admin/submissions/${submissionID}`, {
    method: "DELETE",
  });
  const result = (await response.json()) as DeleteSubmissionResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to delete submission.");
  }
}
