import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  activateContest,
  addUserToContest,
  deactivateContest,
  getContestName,
  updateContestMaxSubs,
} from "../../services/contestService";
import { getTeamName } from "../../services/userService";
import { getUsersByAdmin } from "../../services/uataService";

interface ContestUser {
  userID: number;
  teamName: string;
}

function ContestPage() {
  const navigate = useNavigate();
  const { contestID, adminID } = useParams();
  const [contestName, setContestName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [userID, setUserID] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contestUsers, setContestUsers] = useState<ContestUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

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

  useEffect(() => {
    if (!adminID) {
      setErrorMessage("Admin ID is required.");
      setIsLoadingUsers(false);
      return;
    }

    const adminNumber = Number(adminID);

    if (!Number.isInteger(adminNumber) || adminNumber < 1) {
      setErrorMessage("Invalid admin ID.");
      setIsLoadingUsers(false);
      return;
    }

    async function loadContestUsers() {
      try {
        const userAssociations = await getUsersByAdmin(adminNumber);
        const users = await Promise.all(
          userAssociations.map(async ({ userID }) => ({
            userID,
            teamName: await getTeamName(userID),
          })),
        );
        setContestUsers(users);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load users for this admin.",
        );
      } finally {
        setIsLoadingUsers(false);
      }
    }

    void loadContestUsers();
  }, [adminID]);

  const contestNumber = Number(contestID);

  function clearMessages() {
    setStatusMessage("");
    setErrorMessage("");
  }

  async function runContestAction(
    action: () => Promise<void>,
    successMessage: string,
  ): Promise<boolean> {
    clearMessages();
    setIsSubmitting(true);

    try {
      await action();
      setStatusMessage(successMessage);
      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update contest.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddUser() {
    if (!Number.isInteger(contestNumber) || !Number(userID)) {
      setErrorMessage("A valid user ID is required.");
      return;
    }

    const succeeded = await runContestAction(
      () => addUserToContest(contestNumber, Number(userID)),
      "User added to contest.",
    );
    if (succeeded) {
      setUserID("");
    }
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
          onClick={() =>
            navigate(`/contest/${contestID}/admin/${adminID}/submissions`)
          }
        >
          View Submissions
        </button>
      </section>
      <section>
        <h2>Add User To Contest</h2>
        <select
          value={userID}
          onChange={(event) => setUserID(event.target.value)}
          aria-label="Team name"
          disabled={isLoadingUsers || isSubmitting}
        >
          <option value="">
            {isLoadingUsers ? "Loading teams..." : "Select a team"}
          </option>
          {contestUsers.map((user) => (
            <option key={user.userID} value={user.userID}>
              {user.teamName}
            </option>
          ))}
        </select>
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
