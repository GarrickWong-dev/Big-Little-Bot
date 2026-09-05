import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteSubmission,
  getSubmissionsByContest,
  type Submission,
} from "../../services/submissionsService";
import { getTeamName } from "../../services/userService";

interface DisplaySubmission extends Submission {
  teamName: string;
}

function SubmissionsPage() {
  const navigate = useNavigate();
  const { contestID } = useParams();
  const [submissions, setSubmissions] = useState<DisplaySubmission[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingSubmissionID, setDeletingSubmissionID] = useState<
    number | null
  >(null);

  async function handleDeleteSubmission(submissionID: number) {
    if (!window.confirm("Delete this submission?")) {
      return;
    }

    setErrorMessage("");
    setDeletingSubmissionID(submissionID);

    try {
      await deleteSubmission(submissionID);
      setSubmissions((currentSubmissions) =>
        currentSubmissions.filter(
          (submission) => submission.submissionID !== submissionID,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete submission.",
      );
    } finally {
      setDeletingSubmissionID(null);
    }
  }

  useEffect(() => {
    if (!contestID) {
      setErrorMessage("Contest ID is required.");
      setIsLoading(false);
      return;
    }

    const contestNumber = Number(contestID);

    if (!Number.isInteger(contestNumber) || contestNumber < 1) {
      setErrorMessage("Invalid contest ID.");
      setIsLoading(false);
      return;
    }

    async function loadSubmissions() {
      try {
        const contestSubmissions = await getSubmissionsByContest(contestNumber);
        const submissionsWithTeamNames = await Promise.all(
          contestSubmissions.map(async (submission) => ({
            ...submission,
            teamName: await getTeamName(submission.userID),
          })),
        );
        setSubmissions(submissionsWithTeamNames);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load submissions.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadSubmissions();
  }, [contestID]);

  return (
    <main>
      <button type="button" onClick={() => navigate("/admin")}>
        Back to My Profile
      </button>
      <h1>Submissions</h1>
      {isLoading && <p>Loading submissions...</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {!isLoading && !errorMessage && submissions.length === 0 && (
        <p>No submissions found.</p>
      )}
      {!isLoading && !errorMessage && submissions.length > 0 && (
        <ul>
          {submissions.map((submission) => (
            <li key={submission.submissionID}>
              <p>Team Name: {submission.teamName}</p>
              <p>Points: {submission.points}</p>
              <p>Date: {submission.submissionDate}</p>
              <button
                type="button"
                onClick={() =>
                  void handleDeleteSubmission(submission.submissionID)
                }
                disabled={deletingSubmissionID !== null}
              >
                {deletingSubmissionID === submission.submissionID
                  ? "Deleting..."
                  : "Delete Submission"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default SubmissionsPage;
