import { useNavigate } from "react-router-dom";

function UserPage() {
  const navigate = useNavigate();

  return (
    <main>
      <h1>User</h1>
      <div>
        <button type="button" onClick={() => navigate("/user/my-contests")}>
          My Contests
        </button>
        <button type="button" onClick={() => navigate("/user/make-submission")}>
          Make Submission
        </button>
      </div>
    </main>
  );
}

export default UserPage;
