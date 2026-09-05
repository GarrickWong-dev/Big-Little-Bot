import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createContest, getOwnedContestIds } from "../../services/adminService";
import { getContestName } from "../../services/contestService";
import { createUser } from "../../services/userService";

const ADMIN_ID = 1;

interface OwnedContest {
  contestID: number;
  contestName: string;
}

function AdminPage() {
  const navigate = useNavigate();
  const [contestName, setContestName] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [adminID, setAdminID] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userStatusMessage, setUserStatusMessage] = useState("");
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [ownedContests, setOwnedContests] = useState<OwnedContest[]>([]);
  const [isLoadingContests, setIsLoadingContests] = useState(true);
  const [contestListError, setContestListError] = useState("");

  async function loadOwnedContests() {
    setContestListError("");
    setIsLoadingContests(true);

    try {
      const contestIDs = await getOwnedContestIds(ADMIN_ID);
      const contests = await Promise.all(
        contestIDs.map(async (contestID) => ({
          contestID,
          contestName: await getContestName(contestID),
        })),
      );
      setOwnedContests(contests);
    } catch (error) {
      setContestListError(
        error instanceof Error
          ? error.message
          : "Unable to load owned contests.",
      );
    } finally {
      setIsLoadingContests(false);
    }
  }

  useEffect(() => {
    void loadOwnedContests();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const contest = await createContest({
        contestName,
        maxSubs: maxSubs ? Number(maxSubs) : null,
        adminID: Number(adminID),
      });

      setContestName("");
      setMaxSubs("");
      setAdminID("");
      setStatusMessage(
        `Contest "${contest.contestName}" created successfully.`,
      );
      await loadOwnedContests();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create contest.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUserStatusMessage("");
    setUserErrorMessage("");
    setIsCreatingUser(true);

    try {
      const user = await createUser({
        username,
        password,
        role: "user",
        adminID: ADMIN_ID,
      });

      setUsername("");
      setPassword("");
      setUserStatusMessage(`User "${user.username}" created successfully.`);
    } catch (error) {
      setUserErrorMessage(
        error instanceof Error ? error.message : "Unable to create user.",
      );
    } finally {
      setIsCreatingUser(false);
    }
  }

  return (
    <main>
      <h1>Admin</h1>
      <h2>Create Contest</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="contest-name">Contest name</label>
          <input
            id="contest-name"
            type="text"
            value={contestName}
            onChange={(event) => setContestName(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="max-submissions">Maximum submissions per day</label>
          <input
            id="max-submissions"
            type="number"
            min="1"
            value={maxSubs}
            onChange={(event) => setMaxSubs(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="admin-id">Admin user ID</label>
          <input
            id="admin-id"
            type="number"
            min="1"
            value={adminID}
            onChange={(event) => setAdminID(event.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Contest"}
        </button>
      </form>
      {statusMessage && <p role="status">{statusMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <h2>Create User</h2>
      <form onSubmit={handleCreateUser}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <p>Role: User</p>
        <button type="submit" disabled={isCreatingUser}>
          {isCreatingUser ? "Creating..." : "Create User"}
        </button>
      </form>
      {userStatusMessage && <p role="status">{userStatusMessage}</p>}
      {userErrorMessage && <p role="alert">{userErrorMessage}</p>}
      <section>
        <h2>My Contests</h2>
        {isLoadingContests && <p>Loading contests...</p>}
        {contestListError && <p role="alert">{contestListError}</p>}
        {!isLoadingContests && !contestListError && (
          <ul>
            {ownedContests.map((contest) => (
              <li key={contest.contestID}>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/contest/${contest.contestID}/admin/${ADMIN_ID}`)
                  }
                >
                  {contest.contestName}
                </button>
              </li>
            ))}
          </ul>
        )}
        {!isLoadingContests &&
          !contestListError &&
          ownedContests.length === 0 && <p>No owned contests found.</p>}
      </section>
    </main>
  );
}

export default AdminPage;
