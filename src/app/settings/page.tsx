"use client";
import MainLayout from "@/components/main-layout";
import { ProfileForm } from "./profile-form";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">WORK IN PROGRESS</p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
