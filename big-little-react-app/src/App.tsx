import AdminPage from "./components/Admin/AdminPage";
import ContestPage from "./components/Admin/ContestPage";
import GarrickPage from "./components/Garrick/GarrickPage";
import MainPage from "./components/MainPage";
import MakeSubmission from "./components/User/MakeSubmission/MakeSubmission";
import MyContests from "./components/User/MyContests/MyContests";
import SubmissionsPage from "./components/Admin/SubmissionsPage";
import UserPage from "./components/User/UserPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/garrick" element={<GarrickPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/contest/:contestID" element={<ContestPage />} />
      <Route
        path="/contest/:contestID/submissions"
        element={<SubmissionsPage />}
      />
      <Route path="/user" element={<UserPage />} />
      <Route path="/user/my-contests" element={<MyContests />} />
      <Route path="/user/make-submission" element={<MakeSubmission />} />
    </Routes>
  );
}

export default App;
