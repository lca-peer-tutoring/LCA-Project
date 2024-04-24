import React, { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, onSnapshot } from "firebase/firestore"; // Import onSnapshot
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SessionCard from "./SessionCard";
import Spinner from "react-bootstrap/Spinner"; // Assuming this is the correct import for Spinner

export default function SessionsContainer() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, listen for session updates in their specific subcollection
        const userSessionsRef = collection(db, "users", user.uid, "sessions");

        // Unsubscribe from any previously set up listeners
        setLoading(true);

        // Set up a real-time listener to session updates
        const unsubscribeFromSession = onSnapshot(
          userSessionsRef,
          (snapshot) => {
            const sessionsData = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setSessions(sessionsData);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user sessions:", error);
            // Handle errors here, such as permissions issues or network problems
            setLoading(false);
          }
        );

        return () => {
          unsubscribeFromSession(); // Unsubscribe from session updates when component unmounts or auth state changes
        };
      } else {
        // User is signed out, clear sessions and unsubscribe from any listeners
        setSessions([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeFromAuth(); // Clean up auth listener
    };
  }, [auth]); // Dependency on auth object

  return (
    <>
      {loading ? (
        // Spinner container styled to center only the spinner
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "500px", // Adjust based on typical session card size
          }}
        >
          <Spinner color="blue.500" />
        </div>
      ) : sessions.length > 0 ? (
        // Map through sessions and display them
        sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))
      ) : (
        // Display message or component when there are no sessions
        <p>No sessions available</p>
      )}
    </>
  );
}
