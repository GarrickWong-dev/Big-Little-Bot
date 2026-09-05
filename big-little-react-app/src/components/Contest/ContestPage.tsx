import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContestName } from "../../services/contestService";

function ContestPage() {
  const { contestID } = useParams();
  const [contestName, setContestName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <main>
      {errorMessage ? (
        <p role="alert">{errorMessage}</p>
      ) : (
        <h1>{contestName}</h1>
      )}
    </main>
  );
}

export default ContestPage;
