"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

const initialSubjects = [
  { label: "Algebra I", value: "algebra" },
  { label: "World Literature", value: "literature" },
  { label: "Biology", value: "biology" },
];

const ScheduleForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState(initialSubjects);

  const addSubjectToList = (subjectValue) => {
    const subject = availableSubjects.find((sub) => sub.value === subjectValue);
    if (subject) {
      setSelectedSubjects([...selectedSubjects, subject]);
      setAvailableSubjects(
        availableSubjects.filter((sub) => sub.value !== subjectValue)
      );
    }
  };

  const removeSubjectFromList = (subjectValue) => {
    const subject = selectedSubjects.find((sub) => sub.value === subjectValue);
    if (subject) {
      setAvailableSubjects([...availableSubjects, subject]);
      setSelectedSubjects(
        selectedSubjects.filter((sub) => sub.value !== subjectValue)
      );
    }
  };

  const closeDialog = () => setIsDialogOpen(false);
  const saveRoleChange = () => {
    // Handle the saving logic here
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Select Subjects</Button>
      <ul>
        {selectedSubjects.map((subject) => (
          <li key={subject.value}>
            {subject.label}{" "}
            <button onClick={() => removeSubjectFromList(subject.value)}>
              x
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Subjects</DialogTitle>
            <DialogDescription>Add or remove subjects.</DialogDescription>
          </DialogHeader>
          <Select onValueChange={addSubjectToList}>
            <SelectTrigger aria-label="Subjects">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Subjects</SelectLabel>
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="ghost" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={saveRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleForm;
