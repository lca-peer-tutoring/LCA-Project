import "../components/HomePage.css";
import Scheduler from "../components/Scheduler";
import SessionsContainer from "../components/SessionsContainer";

export default function HomePage() {
  return (
    <div>
      <div className="session-bar flex flex-wrap items-center">
        <h3 className="sessions">Your Sessions</h3>
        <Scheduler />
      </div>
      <div className="session-container">
        <SessionsContainer />
      </div>
    </div>
  );
}
