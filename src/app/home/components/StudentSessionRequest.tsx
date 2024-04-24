import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SessionRequestForm({ userId, onSaveRequest }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openClassCombo, setOpenClassCombo] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "classes"));
        const classesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          label: Object.keys(doc.data())[0],
          value: Object.values(doc.data())[0],
        }));
        setClasses(classesData);
      } catch (err) {
        console.error("Error fetching classes: ", err);
        setError(err);
      }
      setLoading(false);
    };
    fetchClasses();
  }, []);

  const handleSubmit = async () => {
    if (!selectedClass || !comment) {
      alert("Please select a class and enter your comments.");
      return;
    }

    // Define the collection path
    const requestCollectionPath = `users/${userId}/requests`;

    // Check for existing active requests to prevent duplicates
    const requestsQuery = query(
      collection(db, requestCollectionPath),
      where("isActive", "==", true),
      limit(1)
    );
    const existingRequests = await getDocs(requestsQuery);
    if (!existingRequests.empty) {
      alert("You already have an active request.");
      return;
    }

    // Save new request
    try {
      await addDoc(collection(db, requestCollectionPath), {
        classId: selectedClass,
        comment: comment,
        status: "pending",
        isActive: true,
      });
      alert("Your request has been successfully submitted!");
      onSaveRequest(); // Close the dialog
    } catch (err) {
      console.error("Error submitting request: ", err);
      alert("There was an error submitting your request.");
    }
  };

  const handleSelectClass = (classValue) => {
    setSelectedClass(classValue);
    setOpenClassCombo(false);
  };

  if (loading) return <Skeleton className="h-4 w-[200px]" />;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="space-y-4">
      <Popover
        open={openClassCombo}
        onOpenChange={setOpenClassCombo}
        modal={true}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openClassCombo}
            className="justify-between mt-4"
          >
            {selectedClass
              ? classes.find((cls) => cls.value === selectedClass)?.label
              : "Select class..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search class..." />
            <CommandEmpty>No class found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {classes.map((cls) => (
                  <CommandItem
                    key={cls.id}
                    value={cls.value}
                    onSelect={() => handleSelectClass(cls.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedClass === cls.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {cls.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Input
        placeholder="Type your comments here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button onClick={handleSubmit}>Submit Request</Button>
    </div>
  );
}
