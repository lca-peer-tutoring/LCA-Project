import Card from "react-bootstrap/Card";
import "./HomePage.css";

export default function SessionCard({ session }) {
  return (
    <Card className="schedule-card-test" style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{session.class}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Time: {session.time}
        </Card.Subtitle>
        <Card.Text>Tutor: {session.tutor}</Card.Text>
      </Card.Body>
    </Card>
  );
}
