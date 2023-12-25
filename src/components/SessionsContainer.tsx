import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SessionCard from "./SessionCard";

export default function SessionsContainer() {
  const [sessions, setSessions] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const unsubscribe = onSnapshot(
          collection(db, "sessions"),
          (querySnapshot) => {
            const sessionsData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setSessions(sessionsData);
          }
        );

        return () => unsubscribe();
      } else {
        // User is signed out
        setSessions([]);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  return (
    <>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </>
  );
}
