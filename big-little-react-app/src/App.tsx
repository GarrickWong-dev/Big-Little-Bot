import AdminPage from "./components/Admin/AdminPage";
import ContestPage from "./components/Admin/ContestPage";
import GarrickPage from "./components/Garrick/GarrickPage";
import MainPage from "./components/MainPage";
import MakeSubmission from "./components/User/MakeSubmission/MakeSubmission";
import SubmissionsPage from "./components/Admin/SubmissionsPage";
import UserPage from "./components/User/UserPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/garrick" element={<GarrickPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route
        path="/contest/:contestID/admin/:adminID"
        element={<ContestPage />}
      />
      <Route
        path="/contest/:contestID/admin/:adminID/submissions"
        element={<SubmissionsPage />}
      />
      <Route path="/user" element={<UserPage />} />
      <Route path="/user/make-submission" element={<MakeSubmission />} />
    </Routes>
  );
}

export default App;
