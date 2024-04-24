"use client";

import { useState } from "react";
import { auth, db } from "@/firebase/config"; // Ensure this path is correct
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
} from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input"; // Adjust according to your UI library
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  doc,
  setDoc,
  query,
  getDoc,
  collection,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

function AlertDestructive({ title, description }) {
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter(); // Next.js router
  const [username] = email.split("@");
  const [firstName, lastName] = username.split(".");
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    title: "",
    description: "",
  });

  const showAlert = (title, description) => {
    setAlertInfo({ show: true, title, description });
  };

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

  const auth = getAuth();

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsConfirmationOpen(false);
        setIsSuccessAlertOpen(true); // Open success alert dialog
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        setIsConfirmationOpen(false);
      });
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
        // Fetch the user's role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          // Now userData contains the user's document, including the role
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              email: user.email,
              userId: user.uid,
              firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
              lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
              role: userData.role, // Store the role from Firestore
            })
          );
          router.push("/home"); // Navigate to home page after successful login
        } else {
          console.log("No such document!");
        }
      }
    } catch (err) {
      showAlert("Error", "Invalid email or password.");
    }
  };

  const signUp = async () => {
    try {
      // Check if email address is from the allowed domain
      if (!email.endsWith("@lca.edu")) {
        showAlert(
          "danger",
          "Only email addresses from @lca.edu domain are allowed."
        );
        return;
      }

      // Attempt to create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create a user document in Firestore with the "student" role
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        email: email,
        userId: user.uid,
        role: "student", // Default role set to "student"
      });

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
          lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
          email: email,
          userId: user.uid,
          role: "student",
        })
      );

      router.push("/home"); // Navigate to home page after successful signup
    } catch (err) {
      console.error(err);

      // Handle different types of errors
      if (err.code === "auth/email-already-in-use") {
        showAlert("danger", "Email already in use.");
      } else if (err.code === "auth/weak-password") {
        showAlert("danger", "Password should be at least 6 characters.");
      } else {
        showAlert("danger", "Failed to create account. Please try again.");
      }
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
            <Button onClick={logIn} className="mt-4 mr-10">
              Login
            </Button>
            <Button
              onClick={() => setIsConfirmationOpen(true)}
              className="mt-4"
            >
              Forgot Password?
            </Button>
          </CardFooter>
          <AlertDialog
            open={isConfirmationOpen}
            onOpenChange={setIsConfirmationOpen}
          >
            <AlertDialogTrigger asChild>
              <Button className="hidden">Open Confirmation</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Are you sure you want to reset your password?
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsConfirmationOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handlePasswordReset}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog
            open={isSuccessAlertOpen}
            onOpenChange={setIsSuccessAlertOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Password Reset</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                A link to reset your password has been sent to your email.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsSuccessAlertOpen(false)}>
                  Ok
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
      {alertInfo.show && (
        <AlertDestructive
          title={alertInfo.title}
          description={alertInfo.description}
        />
      )}
    </Tabs>
  );
}
