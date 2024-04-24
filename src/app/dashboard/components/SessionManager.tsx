import * as React from "react";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {ClassData} from "./ClassManagement"
import { User } from "../models/User";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
interface SessionManagerProps {
  onSaveSession: () => void;
  selectedClass: string;
  selectedTutor: string;
  setSelectedClass: (value: string) => void;
  setSelectedTutor: (value: string) => void;
  date: any;
  setDate: any;
  userId: string;
}
export interface Tutors{
id: string,
label: string,
value: string
}
export interface Classes{
  id: string,
  label: string,
  value: string,
}
export const SessionManager: React.FC<SessionManagerProps> = ({
  onSaveSession,
  selectedClass,
  selectedTutor,
  setSelectedClass,
  setSelectedTutor,
  date,
  setDate,
  userId,
}) => {
  const [classes, setClasses] = React.useState<Classes[]>([]);
  const [tutors, setTutors] = React.useState<Tutors[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<any>(null);
  const [openClassCombo, setOpenClassCombo] = React.useState(false);
  const [openTutorCombo, setOpenTutorCombo] = React.useState(false);
  const [openCalendar, setOpenCalendar] = React.useState(false);

  const handleSaveSession = async () => {
    if (!selectedClass || !selectedTutor || !date) {
      alert("Please select a class, tutor, and date before saving.");
      return;
    }

    // Ensure date is a valid Date object
    const actualDate = date instanceof Date ? date : new Date(date);
    if (isNaN(actualDate.getTime())) {
      alert("Invalid date. Please pick a valid date.");
      return;
    }

    try {
      // Fetch student details
      const studentDocRef = doc(db, "users", userId);
      const studentDocSnap = await getDoc(studentDocRef);
      const studentData = studentDocSnap.exists()
        ? studentDocSnap.data()
        : null;
      const studentEmail = studentData ? studentData.email : null;
      const studentName = studentData
        ? `${studentData.firstName} ${studentData.lastName}`
        : "Unknown Student"; // Construct full name

      // Fetch tutor email
      const tutorDocRef = doc(db, "users", selectedTutor);
      const tutorDocSnap = await getDoc(tutorDocRef);
      const tutorEmail = tutorDocSnap.exists()
        ? tutorDocSnap.data().email
        : null;

      if (!studentEmail || !tutorEmail) {
        console.error("Missing email for student or tutor.");
        alert("Failed to fetch emails for student or tutor.");
        return;
      }

      // Prepare session data for saving
      const session = {
        class: classes.find((cls) => cls.value === selectedClass)?.label,
        tutor: tutors.find((tutor) => tutor.value === selectedTutor)?.label,
        date: date, // Ensuring the date is in ISO format
      };

      // Save session data
      const studentSessionsPath = `users/${userId}/sessions`;
      await addDoc(collection(db, studentSessionsPath), session);
      const tutorSessionsPath = `users/${selectedTutor}/sessions`;
      await addDoc(collection(db, tutorSessionsPath), session);

      // Deactivate the active request
      const requestsRef = collection(db, `users/${userId}/requests`);
      const activeRequestQuery = query(
        requestsRef,
        where("isActive", "==", true)
      );
      const activeRequestSnapshot = await getDocs(activeRequestQuery);
      if (!activeRequestSnapshot.empty) {
        const activeRequestDocRef = activeRequestSnapshot.docs[0].ref;
        await updateDoc(activeRequestDocRef, { isActive: false });
      }

      // Prepare and send email notification
      const formattedDate = format(actualDate, "PPP"); // Formatting the date for the email
      const formattedTime = format(actualDate, "p"); // Formatting time, e.g., '12:00 PM'
      await addDoc(collection(db, "mail"), {
        to: [studentEmail],
        cc: [tutorEmail],
        subject: "Peer Tutoring Session Confirmation",
        template: {
          name: "session",
          data: {
            student_name: studentName,
            class_name: session.class,
            formatted_date: formattedDate,
            formatted_time: formattedTime, // Including formatted time
            tutor_name: session.tutor,
          },
        },
      });

      alert("Session saved successfully!");
      onSaveSession(); // Close the dialog on success
    } catch (err) {
      console.error("Error saving session: ", err);
      alert("There was an error saving the session.");
    }
  };

  React.useEffect(() => {
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
    };
    fetchClasses();
  }, []);

  React.useEffect(() => {
    const fetchTutors = async () => {
      try {
        const tutorsQuery = query(
          collection(db, "users"),
          where("role", "==", "tutor")
        );
        const querySnapshot = await getDocs(tutorsQuery);
        const tutorsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const fullName = `${data.firstName} ${data.lastName}`;
          return {
            id: doc.id,
            label: fullName,
            value: doc.id,
          };
        });
        setTutors(tutorsData);
      } catch (err) {
        console.error("Error fetching tutors: ", err);
        setError(err);
      }
      setLoading(false);
    };

    fetchTutors();
  }, []);

  React.useEffect(() => {
    console.log("Current date state:", date);
  }, [date]);

  if (loading) return <Skeleton className="h-4 w-[200px]" />;
  if (error) return <div>Error loading data!</div>;

  const handleSelectClass = (classValue: string) => {
    setSelectedClass(classValue);
    setOpenClassCombo(false);
  };

  const handleSelectTutor = (tutorValue: string) => {
    setSelectedTutor(tutorValue);
    setOpenTutorCombo(false);
  };

  const handleDateChange = (isoDate: Date) => {
    setDate(isoDate); // Directly use the ISO string
  };

  const handleToggleCalendar = () => {
    setOpenCalendar((prevState) => !prevState); // Safely toggle based on previous state
  };

  const isValidDate = (d: Date) => d instanceof Date;

  return (
    <div>
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
            className="w-[400px] justify-between mt-4"
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

      <Popover open={openTutorCombo} onOpenChange={setOpenTutorCombo}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openTutorCombo}
            className="w-[400px] justify-between mt-4"
          >
            {selectedTutor
              ? tutors.find((tutor) => tutor.value === selectedTutor)?.label
              : "Select tutor..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search tutor..." />
            <CommandEmpty>No tutor found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {tutors.map((tutor) => (
                  <CommandItem
                    key={tutor.id}
                    value={tutor.value}
                    onSelect={() => handleSelectTutor(tutor.value)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTutor === tutor.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {tutor.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DateTimePicker onDateChange={handleDateChange} />

      <Button
        className="mt-4 justify-between text-left font-normal"
        onClick={handleSaveSession}
      >
        Save Session
      </Button>
    </div>
  );
}
