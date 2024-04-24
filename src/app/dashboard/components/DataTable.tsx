import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { columns as baseColumns } from "./columns"; // Adjust path as necessary
import { User } from "../models/User"; // Adjust path as necessary
import { db } from "@/firebase/config";

export const DataTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersCollectionRef = collection(db, "users");

    const unsubscribe = onSnapshot(
      usersCollectionRef,
      async (snapshot) => {
        const userDataPromises = snapshot.docs.map(async (doc) => {
          const user = { id: doc.id, ...doc.data() } as User;
          // Check if the user has an active request
          const requestRef = collection(db, `users/${user.id}/requests`);
          const requestSnapshot = await getDocs(requestRef);
          user.hasActiveRequest = !requestSnapshot.empty; // Adds a flag for active requests
          return user;
        });

        const users = await Promise.all(userDataPromises);
        setData(users);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUserDelete = (userId: string) => {
    setData((prevData) => prevData.filter((user) => user.id !== userId));
  };

  const columns = baseColumns(handleUserDelete); // Pass both update and delete handlers to columns

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!table || table.getRowModel().rows.length === 0) {
    return <div>No data available or Insufficient Permissions</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
