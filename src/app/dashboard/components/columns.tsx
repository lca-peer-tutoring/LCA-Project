// src/app/dashboard/components/columns.ts
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "../models/User"; // Adjust the import path based on where you've defined the User model
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  // getFirestore,
  collection,
  getDocs,
  getDoc,
  // addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/config";
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {SessionManager} from "./SessionManager";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import { Badge } from "@/components/ui/badge";
// import { Session } from "inspector";
import { getAuth } from "firebase/auth";
import { SessionsDataTable } from "./SessionsDataTable";

export const columns = (
  handleUserDelete: (userId: string) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => info.getValue(),
  },
  {
    id: "requestInfo",
    header: "Request Info",
    cell: ({ row }) => {
      const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
      const [requestData, setRequestData] = useState<DocumentData>();
      const [hasActiveRequest, setHasActiveRequest] = useState(false);

      const fetchRequestData = async () => {
        const requestsRef = collection(
          db,
          `users/${row.original.userId}/requests`
        );
        const q = query(requestsRef, where("isActive", "==", true));
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map((doc) => doc.data());
        setRequestData(requests.length > 0 ? requests[0]: undefined);
        setHasActiveRequest(requests.length > 0);
      };

      useEffect(() => {
        fetchRequestData();
      }, []);

      return (
        <>
          {hasActiveRequest && ( // Only render button if there is an active request
            <>
              <Button onClick={() => setIsRequestDialogOpen(true)}>
                View Request
              </Button>
              <Dialog
                open={isRequestDialogOpen}
                onOpenChange={setIsRequestDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Information</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Class: {requestData?.classId}
                    <br />
                    Comment: {requestData?.comment}
                    <br />
                    Status: {requestData?.status}
                  </DialogDescription>
                  <DialogFooter>
                    <Button onClick={() => setIsRequestDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
      const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
      const [selectedRole, setSelectedRole] = useState(row.original.role.toString());
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      const [selectedClass, setSelectedClass] = useState("");
      const [selectedTutor, setSelectedTutor] = useState("");
      const [date, setDate] = useState({ date: undefined, hasTime: true });
      const [isAllSessionsDialogOpen, setIsAllSessionsDialogOpen] =
        useState(false);

      const userId = row.original.userId;

      const handleDeleteUser = async () => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) {
          alert("No user is currently logged in.");
          return;
        }
        const currentUserRef = doc(db, "users", currentUser.uid);
        const currentUserSnap = await getDoc(currentUserRef);

        if (
          currentUserSnap.exists() &&
          currentUserSnap.data().role === "admin"
        ) {
          const userToDeleteRef = doc(db, "users", row.original.userId);
          try {
            await deleteDoc(userToDeleteRef);
            alert("User deleted successfully.");
            setIsDeleteDialogOpen(false);
          } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
          }
        } else {
          alert("Only admins can delete accounts.");
        }
      };

      const toggleRoleDialog = () => setIsRoleDialogOpen(!isRoleDialogOpen);
      const toggleSessionDialog = () =>
        setIsSessionDialogOpen(!isSessionDialogOpen);
      const toggleDeleteDialog = () =>
        setIsDeleteDialogOpen(!isDeleteDialogOpen);

      const saveRoleChange = async () => {
        const userRef = doc(db, "users", row.original.userId);
        try {
          await updateDoc(userRef, { role: selectedRole });
          toggleRoleDialog();
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      };

      return (
        <div className="flex items-center justify-between w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-gray-700">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={toggleRoleDialog}>
                Change Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setIsSessionDialogOpen(true)}>
                Set Sessions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setIsAllSessionsDialogOpen(true)}
              >
                View All Sessions
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={toggleDeleteDialog}>
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* View Sessions Dialog */}
          <Dialog
            open={isAllSessionsDialogOpen}
            onOpenChange={setIsAllSessionsDialogOpen}
          >
            <DialogContent className="min-w-full h-fit">
              <DialogHeader>
                <DialogTitle>All Sessions</DialogTitle>
              </DialogHeader>
              <SessionsDataTable userId={row.original.userId} />
              <DialogFooter>
                <Button onClick={() => setIsAllSessionsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Role Change Dialog */}
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogDescription>Update the user's role.</DialogDescription>
              </DialogHeader>
              <Select onValueChange={setSelectedRole} value={selectedRole}>
                <SelectTrigger aria-label="Role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <DialogFooter>
                <Button variant="ghost" onClick={toggleRoleDialog}>
                  Cancel
                </Button>
                <Button onClick={saveRoleChange}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* Sessions Set Dialog */}
          <Dialog
            open={isSessionDialogOpen}
            onOpenChange={setIsSessionDialogOpen}
          >
            <DialogContent>
              {/* ... dialog header and description */}
              <DialogHeader>
                <DialogTitle>Set Sessions</DialogTitle>
                <DialogDescription>
                  Configure session details here.
                </DialogDescription>
              </DialogHeader>
              <SessionManager
                onSaveSession={() => {
                  setIsSessionDialogOpen(false); // Close the dialog on save completion
                }}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                selectedTutor={selectedTutor}
                setSelectedTutor={setSelectedTutor}
                date={date}
                setDate={setDate}
                userId={userId}
              />
              {/* DialogFooter and Cancel button remain unchanged */}
            </DialogContent>
          </Dialog>

          {/* Delete User Confirmation Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete User</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={toggleDeleteDialog}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteUser}
                  color="red"
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
    enableSorting: false,
  },
];
