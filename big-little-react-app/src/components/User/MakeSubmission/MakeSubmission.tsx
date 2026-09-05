import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { getCurrentUser } from "../../../services/authService";
import { useNavigate } from "react-router-dom";
import {
  getContestName,
  getContestsByUser,
} from "../../../services/contestService";
import { createSubmission } from "../../../services/submissionsService";

interface UserContest {
  contestID: number;
  contestName: string;
}

function getCurrentDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
}

function MakeSubmission() {
  const userID = getCurrentUser()?.userID;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [contestID, setContestID] = useState("");
  const [submissionDate, setSubmissionDate] = useState(getCurrentDate);
  const [points, setPoints] = useState("");
  const [picture, setPicture] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contests, setContests] = useState<UserContest[]>([]);
  const [isLoadingContests, setIsLoadingContests] = useState(true);

  useEffect(() => {
    async function loadContests() {
      try {
        if (!userID) {
          throw new Error("You must be logged in as a user.");
        }

        const contestIDs = await getContestsByUser(userID);
        const userContests = await Promise.all(
          contestIDs.map(async (contestID) => ({
            contestID,
            contestName: await getContestName(contestID),
          })),
        );
        setContests(userContests);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your contests.",
        );
      } finally {
        setIsLoadingContests(false);
      }
    }

    void loadContests();
  }, [userID]);

  function handlePictureChange(event: ChangeEvent<HTMLInputElement>) {
    setPicture(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");

    if (!picture) {
      setErrorMessage("A picture is required.");
      return;
    }

    const contestNumber = Number(contestID);
    const pointsNumber = Number(points);

    if (!Number.isInteger(contestNumber) || contestNumber < 1) {
      setErrorMessage("A valid contest ID is required.");
      return;
    }

    if (!Number.isFinite(pointsNumber)) {
      setErrorMessage("A valid points value is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createSubmission({
        title,
        userID: userID ?? 0,
        contestID: contestNumber,
        submissionDate,
        points: pointsNumber,
        picture,
      });

      setTitle("");
      setContestID("");
      setSubmissionDate(getCurrentDate());
      setPoints("");
      setPicture(null);
      setStatusMessage("Submission created successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create submission.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Make Submission</h1>
      <button type="button" onClick={() => navigate("/user")}>
        Back to My Profile
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="submission-title">Title</label>
          <input
            id="submission-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="submission-contest">Contest</label>
          <select
            id="submission-contest"
            value={contestID}
            onChange={(event) => setContestID(event.target.value)}
            disabled={isLoadingContests || isSubmitting}
            required
          >
            <option value="">
              {isLoadingContests ? "Loading contests..." : "Select a contest"}
            </option>
            {contests.map((contest) => (
              <option key={contest.contestID} value={contest.contestID}>
                {contest.contestName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="submission-date">Date</label>
          <input
            id="submission-date"
            type="text"
            value={submissionDate}
            readOnly
            required
          />
        </div>
        <div>
          <label htmlFor="submission-points">Points</label>
          <input
            id="submission-points"
            type="number"
            value={points}
            onChange={(event) => setPoints(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="submission-picture">Picture</label>
          <input
            id="submission-picture"
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {statusMessage && <p role="status">{statusMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </main>
  );
}

export default MakeSubmission;
