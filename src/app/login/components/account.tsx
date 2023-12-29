"use client";

import { useState } from "react";
import { auth, db } from "@/firebase/config"; // Ensure this path is correct
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Adjust according to your UI library
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  doc,
  setDoc,
  query,
  getDocs,
  collection,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter(); // Next.js router
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [username] = email.split("@");
  const [firstName, lastName] = username.split(".");

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential) {
        const user = userCredential.user;

        // Store user information in local storage after successful login
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            email: user.email, // Email from user credential
            userId: user.uid, // User ID from user credential
            firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
            lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
          })
        );

        router.push("/home"); // Navigate to home page after successful login
      }
    } catch (err) {
      showAlert("danger", "Invalid email or password."); // Show error alert
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      showAlert("success", "Reset password email has been sent."); // Show success alert
    } catch (err) {
      showAlert("danger", "Invalid email."); // Show error alert
    }
  };

  const signUp = async () => {
    try {
      // Check if email address is from the allowed domain
      if (email.endsWith("@lca.edu")) {
        // Check if user already exists in Firestore

        // Proceed with signup if user doesn't exist
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Create a user document in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
          lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
          email: email,
          userId: user.uid,
        });

        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
            lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
            email: email,
            userId: user.uid,
          })
        );

        router.push("/home"); // Navigate to home page after successful signup
      } else {
        // Email address is not from the allowed domain, show an error message
        showAlert(
          "danger",
          "Only email addresses from @lca.edu domain are allowed."
        );
      }
    } catch (err) {
      console.error(err);
      showAlert("danger", "Email already in use."); // Show error alert
    }
  };

  // Toggle password visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Tabs defaultValue="log-in" className="w-[500px] h-[200px] mx-auto my-20">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="log-in">Log In</TabsTrigger>
        <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="log-in">
        <Card>
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>
              Please log in with your LCA domain email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Email Input */}
            <div className="space-y-1">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Input */}
            <div className="space-y-1">
              <Input
                id="password"
                type={isVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={logIn}>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="sign-up">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Please sign up with your LCA domain email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Email Input */}
            <div className="space-y-1">
              <Input
                id="signup-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Password Input */}
            <div className="space-y-1">
              <Input
                id="signup-password"
                type={isVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* Additional fields as needed for sign-up */}
          </CardContent>
          <CardFooter>
            <Button onClick={signUp}>Register</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
