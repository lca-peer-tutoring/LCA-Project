"use client";
import AccountPage from "./components/account";
import MainLayout from "@/components/main-layout";

export default function LoginPage() {
  return (
    <>
      <MainLayout />
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 mt-[-400px]">
          {" "}
          {/* Use negative margin-top to move up */}
          <AccountPage /> {/* This is your AccountPage component */}
        </div>
      </div>
    </>
  );
}
