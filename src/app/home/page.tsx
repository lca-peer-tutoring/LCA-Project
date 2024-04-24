"use client";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./components/HomePage.css";
import SessionsContainer from "./components/SessionsContainer";
import MainLayout from "@/components/main-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SessionRequestForm from "./components/StudentSessionRequest"; // Ensure this path is correct

export default function HomePage() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Assuming user IDs are managed by Firebase Auth
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe(); // Clean up the subscription
  }, []);

  const toggleRequestDialog = () => {
    setIsRequestDialogOpen(!isRequestDialogOpen);
  };

  if (!userId) {
    return (
      <div>
        <MainLayout />
        <div>Please log in to request a session.</div>
      </div>
    );
  }

  return (
    <div>
      <MainLayout />
      <div>
        <div className="session-bar flex flex-wrap items-center justify-between p-4">
          <h3 className="text-lg font-medium transition-colors">
            Your Sessions
          </h3>
          <Button className="mr-1" onClick={toggleRequestDialog}>
            Request a Session
          </Button>
        </div>
        <div className="session-container">
          <SessionsContainer />
        </div>
      </div>
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Tutoring Session</DialogTitle>
            <DialogDescription>
              Fill out the form to request a new tutoring session.
            </DialogDescription>
          </DialogHeader>
          <SessionRequestForm
            userId={userId}
            onSaveRequest={() => {
              setIsRequestDialogOpen(false); // Close the dialog on save completion
            }}
          />
          <DialogFooter>
            <Button onClick={toggleRequestDialog}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
