import { useState } from "react";
import type { FormEvent } from "react";
import { createUser } from "../../services/userService";

const GARRICK_USER_ID = -1;

function GarrickPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await createUser({
        username,
        password,
        role: "admin",
        adminID: GARRICK_USER_ID,
      });

      setUsername("");
      setPassword("");
      setStatusMessage("Admin user created successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create admin user.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Garrick</h1>
      <h2>Create Admin User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <p>Role: Admin</p>
        <p>Admin users do not have a team.</p>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Admin User"}
        </button>
      </form>
      {statusMessage && <p role="status">{statusMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </main>
  );
}

export default GarrickPage;
