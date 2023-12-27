import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SessionCard from "./SessionCard";

export default function SessionsContainer() {
  const [sessions, setSessions] = useState([]);
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const fetchData = async () => {
          const querySnapshot = await getDocs(collection(db, "sessions"));
          const sessionsData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setSessions(sessionsData);
        };

        fetchData();
      } else {
        // User is signed out
        setSessions([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <>
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </>
  );
}
