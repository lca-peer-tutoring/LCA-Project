import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { db } from "@/firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export type Session = {
  sessionId: string;
  date: string;
  class: string;
  tutor: string;
};

const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "date",
    header: () => "Date and Time",
    cell: (info: any) => format(parseISO(info.getValue()), "PPP, p"), // Now includes time
  },
  {
    accessorKey: "class",
    header: () => "Class",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "tutor",
    header: () => "Tutor",
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.sessionId,
    id: "actions",
    cell: (info: any) => (
      <div className="flex items-center justify-end space-x-2">
        <Button
          onClick={() => {
            console.log(`Session ID: ${info.row.original.sessionId}`);
            if (info.row.original.sessionId) {
              info.table.options.meta?.deleteSession(
                info.row.original.sessionId
              );
            } else {
              console.error("No session ID available for deletion.");
            }
          }}
        >
          Delete
        </Button>
      </div>
    ),
    header: () => <span>Actions</span>,
  },
];

export const SessionsDataTable = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching sessions for user ID: ${userId}`);
    const fetchData = async () => {
      const sessionsRef = collection(db, `users/${userId}/sessions`);
      const snapshot = await getDocs(sessionsRef);
      const sessionsData = snapshot.docs.map((doc) => ({
        ...(doc.data() as Session),
        sessionId: doc.id,
      }));
      console.log("Sessions Data with IDs:", sessionsData);
      setData(sessionsData);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleDeleteSession = async (sessionId: string) => {
    console.log(
      `Attempting to delete session ID: ${sessionId} for user ID: ${userId}`
    );
    if (!userId || !sessionId) {
      console.error("Invalid user ID or session ID.");
      return;
    }

    try {
      const sessionRef = doc(db, `users/${userId}/sessions`, sessionId);
      await deleteDoc(sessionRef);
      setData((data) =>
        data.filter((session) => session.sessionId !== sessionId)
      );
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      deleteSession: handleDeleteSession,
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border p-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                // Updated to ensure header color adapts to light/dark mode and removed borders
                <TableHead key={header.id}>
                  {flexRender(
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
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="p-2">
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
