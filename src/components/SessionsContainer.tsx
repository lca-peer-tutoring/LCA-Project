import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SessionCard from "./SessionCard";

export default function SessionsContainer() {
  const [sessions, setSessions] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch sessions from their specific subcollection
        const userSessionsRef = collection(db, "users", user.uid, "sessions");
        try {
          const querySnapshot = await getDocs(userSessionsRef);
          const sessionsData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setSessions(sessionsData);
        } catch (error) {
          console.error("Error fetching user sessions:", error);
          // Handle errors, such as permissions issues or network problems
        }
      } else {
        // User is signed out, clear sessions
        setSessions([]);
      }
    });

    return () => unsubscribe();
  }, [auth]); // Dependency on auth object

  return (
    <>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </>
  );
}
