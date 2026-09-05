import { useNavigate } from "react-router-dom";

function MainPage() {
  const navigate = useNavigate();

  return (
    <main>
      <h1>Home Page</h1>
      <div>
        <button type="button" onClick={() => navigate("/garrick")}>
          Garrick
        </button>
        <button type="button" onClick={() => navigate("/admin")}>
          Admin
        </button>
        <button type="button" onClick={() => navigate("/user")}>
          User
        </button>
      </div>
    </main>
  );
}

export default MainPage;
