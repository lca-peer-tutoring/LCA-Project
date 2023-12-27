import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { db, auth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function SettingsPage() {
  const [user, setUser] = useState({ email: "", firstName: "", lastName: "" });

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Define the path to the user's document once user is confirmed logged in
        const userDocRef = doc(db, "users", currentUser.uid);

        // Subscribe to the document for real-time updates
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUser(doc.data());
          } else {
            console.log("No such document!");
          }
        });

        // Cleanup subscription to the document
        return () => unsubscribeSnapshot();
      } else {
        // Handle user not logged in or wait for authentication
        console.log("User is not logged in or waiting for auth");
        // Optionally reset user state or handle the case appropriately
        setUser({ email: "", firstName: "", lastName: "" });
      }
    });

    // Cleanup the auth state listener on unmount
    return () => unsubscribeAuth();
  }, []);

  // Render or redirect logic based on user state can go here
  // ...

  return (
    <MainLayout>
      <div>
        <h1>Settings</h1>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>First Name:</strong> {user.firstName}
        </div>
        <div>
          <strong>Last Name:</strong> {user.lastName}
        </div>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;
