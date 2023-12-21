import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import SessionCard from "./SessionCard";

export default function SessionsContainer() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "sessions"));
      const sessionsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSessions(sessionsData);
    };

    fetchData();
  }, []);

  return (
    <>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </>
  );
}
