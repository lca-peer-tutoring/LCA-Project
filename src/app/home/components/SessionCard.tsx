import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./HomePage.css"; // Assuming you still want to use some custom styles

export default function SessionCard({ session }) {
  // Ensure session data is available
  if (!session) {
    return <div>Session information is missing</div>;
  }

  return (
    <Card className="schedule-card-test" style={{ width: "18rem" }}>
      <CardHeader>
        <CardTitle>{session.class || "Class Information"}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <strong>Time:</strong> {session.time || "N/A"}
        </CardDescription>
        <CardDescription>
          <strong>Tutor:</strong> {session.tutor || "N/A"}
        </CardDescription>
      </CardContent>
      <CardFooter>{/* add text here */}</CardFooter>
    </Card>
  );
}
