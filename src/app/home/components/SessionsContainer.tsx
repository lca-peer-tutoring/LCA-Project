import React, { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SessionCard from "./SessionCard";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this path is correct

export default function SessionsContainer() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userSessionsRef = collection(db, "users", user.uid, "sessions");
        setLoading(true);

        const unsubscribeFromSession = onSnapshot(
          userSessionsRef,
          (snapshot) => {
            const oneHourAgo = new Date(Date.now() - 3600000); // Current time minus one hour
            const sessionsData = snapshot.docs
              .map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }))
              .filter((session) => new Date(session.date) > oneHourAgo);
            setSessions(sessionsData);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user sessions:", error);
            setLoading(false);
          }
        );

        return () => unsubscribeFromSession();
      } else {
        setSessions([]);
        setLoading(false);
      }
    });

    return () => unsubscribeFromAuth();
  }, [auth]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="flex flex-wrap justify-start items-start gap-5 p-5">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <p>No sessions available</p>
      )}
    </>
  );
}
