"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { init } from "next/dist/compiled/webpack/webpack";
import { link } from "fs";

export function UserNav() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [initials, setInitials] = useState("");
  const router = useRouter(); // Next.js router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const { firstName, lastName } = JSON.parse(storedUserInfo);
          setName(`${firstName} ${lastName}`);
          setInitials(
            `${
              firstName.charAt(0).toUpperCase() +
              lastName.charAt(0).toUpperCase()
            }`
          );
          const { email } = JSON.parse(storedUserInfo);
          setEmail(`${email}`);
        }
      }
      setLoading(false); // Set loading to false after user is fetched
    });

    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      router.push("/login");
      setName(""); // Reset name on logout
    } catch (err) {
      console.error(err);
    }
  };

  const linkToSettings = () => {
    router.push("/settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem key="settings" onClick={linkToSettings}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem key="logout" onClick={logOut}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
