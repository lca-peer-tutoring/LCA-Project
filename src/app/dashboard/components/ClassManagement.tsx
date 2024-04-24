// src/app/dashboard/components/ClassManagement.tsx
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
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ClassData {
  id: string;
  [key: string]: string; // This will allow for dynamic keys representing class names
}

export const ClassManagement = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClassName, setNewClassName] = useState("");

  const deleteClass = async (classId: string) => {
    // Confirmation dialog can be added here
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteDoc(doc(db, "classes", classId));
        alert("Class deleted successfully.");
        // Remove the class from the local state to update the UI
        setClasses((prevClasses) =>
          prevClasses.filter((c) => c.id !== classId)
        );
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Failed to delete class.");
      }
    }
  };

  const addNewClass = async () => {
    if (!newClassName.trim()) {
      alert("Class name cannot be empty.");
      return;
    }
    try {
      const classNameKey = newClassName.trim().replace(/\s+/g, "");
      const newClassData = { [classNameKey]: newClassName };
      const docRef = await addDoc(collection(db, "classes"), newClassData);

      // Update the local state with the new class
      setClasses((prevClasses) => [
        ...prevClasses,
        { id: docRef.id, name: newClassName }, // Maintain the 'name' key as in the fetched classes
      ]);

      setNewClassName(""); // Clear input field after adding
      alert("Class added successfully.");
    } catch (error) {
      console.error("Error adding new class:", error);
      alert("Failed to add new class.");
    }
  };

  useEffect(() => {
    const fetchClasses = async () => {
      const classesCollectionRef = collection(db, "classes");
      try {
        const querySnapshot = await getDocs(classesCollectionRef);
        const classesList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const className = Object.keys(data).find(
            (key) => key !== "id" && key !== "name"
          );
          return {
            id: doc.id,
            name: className ? data[className] : "Unknown",
          };
        });
        setClasses(classesList);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const columns: ColumnDef<ClassData>[] = [
    {
      accessorKey: "name",
      header: "Class Name",
      cell: (info) => info.getValue(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Button onClick={() => deleteClass(row.original.id)}>Delete</Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: classes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (classes.length === 0) {
    return <div>No classes available or Insufficient Permissions</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <Input
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Enter new class name"
        />
        <Button onClick={addNewClass}>Add Class</Button>
      </div>
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
            <TableRow key={row.id}>
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
