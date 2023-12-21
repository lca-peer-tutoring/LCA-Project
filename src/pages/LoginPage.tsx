import { useState } from "react";
import React from "react";
import MainLayout from "../layout/MainLayout";
import GoogleButton from "react-google-button";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Input, Button } from "@nextui-org/react";
import { EyeFilledIcon } from "../assets/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../assets/EyeSlashFilledIcon";

export const LoginPage = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("user logged in: ", user);
    } else {
      console.log("user logged out");
    }
  });

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col w-full h-full justify-center items-center pt-4">
        <Input
          isRequired
          type="email"
          label="Email"
          variant="bordered"
          isInvalid={true}
          errorMessage="Please enter a valid email"
          className="max-w-xs mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          isRequired
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs mb-4"
        />
        <Button
          variant="ghost"
          color="primary"
          size="lg"
          onClick={logIn}
          className="mx-auto mb-4"
        >
          {" "}
          Log In
        </Button>
        <Button
          variant="ghost"
          color="primary"
          size="lg"
          onClick={signUp}
          className="mx-auto mb-4"
        >
          {" "}
          Sign Up
        </Button>

        <Button
          variant="ghost"
          color="primary"
          size="lg"
          onClick={logOut}
          className="mx-auto"
        >
          {" "}
          logOut
        </Button>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
