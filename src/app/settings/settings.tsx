import { useEffect, useState } from "react";
import MainLayout from "../___layout/MainLayout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function SettingsPage() {
  const [user, setUser] = useState({ email: "", firstName: "", lastName: "" });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Attempt to retrieve user information from local storage
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const userInfo = JSON.parse(storedUserInfo);
          setUser({
            email: userInfo.email || "",
            firstName: userInfo.firstName || "",
            lastName: userInfo.lastName || "",
          });
        } else {
          console.log("No user info found in local storage!");
          // Optionally handle the case where no user info is found in local storage
        }
      } else {
        // Handle user not logged in or wait for authentication
        console.log("User is not logged in or waiting for auth");
        setUser({ email: "", firstName: "", lastName: "" });
      }
    });

    // Cleanup the auth state listener on unmount
    return () => unsubscribeAuth();
  }, []);

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
