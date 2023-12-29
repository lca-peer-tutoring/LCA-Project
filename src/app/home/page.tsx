"use client";

import Image from "next/image";
import "./components/HomePage.css";
import SessionsContainer from "./components/SessionsContainer";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import logo from "@/assets/lcaLogo.svg";

export default function HomePage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row">
        {" "}
        <div className="flex items-center border-b w-full py-4">
          {" "}
          <div className="flex items-center px-8">
            {" "}
            <Image src={logo} width={64} height={36} alt="LCA logo" />
          </div>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            {" "}
            <UserNav />
          </div>
        </div>
      </div>
      <div>
        <div className="session-bar flex flex-wrap items-center">
          <h3 className="sessions">Your Sessions</h3>
          test
        </div>
        <div className="session-container">
          <SessionsContainer />
        </div>
      </div>
    </div>
  );
}
