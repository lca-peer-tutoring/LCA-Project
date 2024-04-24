"use client";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase/config";
import MainLayout from "@/components/main-layout";
import { DataTable } from "./components/DataTable";
import { User } from "@/app/dashboard/models/User";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ClassManagement } from "./components/ClassManagement";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isClassDialogOpen, setClassDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUserRole = async () => {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserRole(userSnap.data().role);
          }
        };
        fetchUserRole();
      }
    });

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => doc.data() as User);
      setUsers(usersData);
    };

    fetchUsers();
  }, [auth]);

  const toggleClassDialog = () => setClassDialogOpen(!isClassDialogOpen);

  return (
    <>
      <MainLayout />
      <div className="container mx-auto py-10">
        {userRole === "admin" && (
          <>
            <Button onClick={toggleClassDialog}>Manage Classes</Button>
            <Dialog open={isClassDialogOpen} onOpenChange={toggleClassDialog}>
              <DialogContent className="overflow-y-scroll max-h-96">
                <DialogHeader>
                  <DialogTitle>Class Management</DialogTitle>
                </DialogHeader>
                <ClassManagement />
                <DialogFooter>
                  <Button onClick={toggleClassDialog}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        <DataTable />
      </div>
    </>
  );
}
