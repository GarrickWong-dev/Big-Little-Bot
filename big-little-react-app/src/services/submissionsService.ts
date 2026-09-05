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

interface CreateSubmissionResponse {
  success: boolean;
  submission: Submission;
  message?: string;
}

export interface CreateSubmissionInput {
  title: string;
  userID: number;
  contestID: number;
  submissionDate: string;
  points: number;
  picture: File;
}

export async function createSubmission(
  input: CreateSubmissionInput,
): Promise<Submission> {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("userID", String(input.userID));
  formData.append("contestID", String(input.contestID));
  formData.append("submissionDate", input.submissionDate);
  formData.append("points", String(input.points));
  formData.append("picture", input.picture);

  const response = await fetch("/user/submissions", {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as CreateSubmissionResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to create submission.");
  }

  return result.submission;
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

export async function getSubmissionsByUser(
  userID: number,
): Promise<Submission[]> {
  const response = await fetch(`/subs/user/${userID}`);
  const result = (await response.json()) as SubmissionsResponse;

  if (!response.ok) {
    throw new Error(result.message || "Unable to load user submissions.");
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
