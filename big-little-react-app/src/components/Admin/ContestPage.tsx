import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  activateContest,
  addUserToContest,
  deactivateContest,
  getContestName,
  updateContestMaxSubs,
} from "../../services/contestService";

function ContestPage() {
  const navigate = useNavigate();
  const { contestID } = useParams();
  const [contestName, setContestName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [userID, setUserID] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!contestID) {
      setErrorMessage("Contest ID is required.");
      return;
    }

    const contestNumber = Number(contestID);

    if (!Number.isInteger(contestNumber) || contestNumber < 1) {
      setErrorMessage("Invalid contest ID.");
      return;
    }

    async function loadContestName() {
      try {
        setContestName(await getContestName(contestNumber));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load contest.",
        );
      }
    }

    void loadContestName();
  }, [contestID]);

  const contestNumber = Number(contestID);

  function clearMessages() {
    setStatusMessage("");
    setErrorMessage("");
  }

  async function runContestAction(
    action: () => Promise<void>,
    successMessage: string,
  ) {
    clearMessages();
    setIsSubmitting(true);

    try {
      await action();
      setStatusMessage(successMessage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update contest.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddUser() {
    if (!Number.isInteger(contestNumber) || !Number(userID)) {
      setErrorMessage("A valid user ID is required.");
      return;
    }

    await runContestAction(
      () => addUserToContest(contestNumber, Number(userID)),
      "User added to contest.",
    );
    setUserID("");
  }

  async function handleMaxSubsUpdate() {
    if (!Number.isInteger(contestNumber)) {
      setErrorMessage("A valid contest ID is required.");
      return;
    }

    const limit = maxSubs ? Number(maxSubs) : null;

    if (limit !== null && (!Number.isInteger(limit) || limit < 1)) {
      setErrorMessage("Maximum submissions must be a positive whole number.");
      return;
    }

    await runContestAction(
      () => updateContestMaxSubs(contestNumber, limit),
      "Contest submission limit updated.",
    );
  }

  async function handleActivationChange(active: boolean) {
    if (!Number.isInteger(contestNumber)) {
      setErrorMessage("A valid contest ID is required.");
      return;
    }

    await runContestAction(
      () =>
        active
          ? activateContest(contestNumber)
          : deactivateContest(contestNumber),
      active ? "Contest activated." : "Contest deactivated.",
    );
  }

  return (
    <main>
      <h1>{contestName || "Contest"}</h1>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {statusMessage && <p role="status">{statusMessage}</p>}
      <section>
        <h2>Submissions</h2>
        <button
          type="button"
          onClick={() => navigate(`/contest/${contestID}/submissions`)}
        >
          View Submissions
        </button>
      </section>
      <section>
        <h2>Add User To Contest</h2>
        <input
          type="number"
          min="1"
          value={userID}
          onChange={(event) => setUserID(event.target.value)}
          placeholder="User ID"
          aria-label="User ID"
        />
        <button type="button" onClick={handleAddUser} disabled={isSubmitting}>
          Add User
        </button>
      </section>
      <section>
        <h2>Submission Limit</h2>
        <input
          type="number"
          min="1"
          value={maxSubs}
          onChange={(event) => setMaxSubs(event.target.value)}
          placeholder="Maximum submissions"
          aria-label="Maximum submissions"
        />
        <button
          type="button"
          onClick={handleMaxSubsUpdate}
          disabled={isSubmitting}
        >
          Update Limit
        </button>
      </section>
      <section>
        <h2>Contest Status</h2>
        <button
          type="button"
          onClick={() => void handleActivationChange(true)}
          disabled={isSubmitting}
        >
          Activate
        </button>
        <button
          type="button"
          onClick={() => void handleActivationChange(false)}
          disabled={isSubmitting}
        >
          Deactivate
        </button>
      </section>
    </main>
  );
}

export default ContestPage;
