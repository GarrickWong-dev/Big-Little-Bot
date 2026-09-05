import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import {
  getSubmissionsByUser,
  type Submission,
} from "../../services/submissionsService";
import { getTeamName } from "../../services/userService";

function UserPage() {
  const navigate = useNavigate();
  const userID = getCurrentUser()?.userID;
  const [teamName, setTeamName] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        if (!userID) {
          throw new Error("You must be logged in as a user.");
        }

        const [loadedTeamName, userSubmissions] = await Promise.all([
          getTeamName(userID),
          getSubmissionsByUser(userID),
        ]);
        setTeamName(loadedTeamName);
        userSubmissions.sort((left, right) => {
          const dateDifference =
            Date.parse(right.submissionDate) - Date.parse(left.submissionDate);

          return dateDifference || right.submissionID - left.submissionID;
        });
        setSubmissions(userSubmissions);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your submissions.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadSubmissions();
  }, [userID]);

  return (
    <main>
      <h1>{teamName || "User"}</h1>
      <div>
        <button type="button" onClick={() => navigate("/user/make-submission")}>
          Make Submission
        </button>
      </div>
      <section>
        <h2>My Submissions</h2>
        {isLoading && <p>Loading submissions...</p>}
        {errorMessage && <p role="alert">{errorMessage}</p>}
        {!isLoading && !errorMessage && submissions.length === 0 && (
          <p>No submissions found.</p>
        )}
        {!isLoading && !errorMessage && submissions.length > 0 && (
          <ul>
            {submissions.map((submission) => (
              <li key={submission.submissionID}>
                <h3>{submission.title}</h3>
                <p>Points: {submission.points}</p>
                <p>Date: {submission.submissionDate}</p>
                <img
                  src={`http://18.188.158.238:3000${submission.picturePath}`}
                  alt={submission.title}
                  width="200"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default UserPage;
