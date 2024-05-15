import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

export default function SessionCard({ session }) {
  const [tutorName, setTutorName] = useState("");

  useEffect(() => {
    if (session && session.tutor) {
      setTutorName(session.tutor);
    } else {
      setTutorName("No tutor assigned");
    }
  }, [session]);

  if (!session) {
    return <div>Session information is missing</div>;
  }

  const formattedDate = session.date
    ? format(new Date(session.date), "MMMM d, yyyy, hh:mm a") // Now includes time
    : "Date N/A";

  return (
    <Card className="w-72 bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle>{session.class || "Class Information"}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <strong>Date:</strong> {formattedDate}
        </CardDescription>
        <CardDescription>
          <strong>Tutor:</strong> {tutorName || "Fetching tutor..."}
        </CardDescription>
      </CardContent>
      <CardFooter>{/* Optional footer text or elements */}</CardFooter>
    </Card>
  );
}
