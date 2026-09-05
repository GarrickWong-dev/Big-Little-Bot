import { useState } from "react";
import type { FormEvent } from "react";
import { createContest } from "../../services/adminService";

function AdminPage() {
  const [contestName, setContestName] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [adminID, setAdminID] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create contest.",
      );
    } finally {
      setIsSubmitting(false);
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
    </main>
  );
}

export default AdminPage;
