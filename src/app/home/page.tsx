"use client";

import Image from "next/image";
import "./components/HomePage.css";
import SessionsContainer from "./components/SessionsContainer";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import logo from "@/assets/lcaLogo.svg";
import MainLayout from "@/components/main-layout";

export default function HomePage() {
  return (
    <div>
      <MainLayout />
      <div>
        <div className="session-bar flex flex-wrap items-center">
          <h3 className="text-lg font-medium transition-colors">
            Your Sessions
          </h3>
        </div>
        <div className="session-container">
          <SessionsContainer />
        </div>
      </div>
    </div>
  );
}
