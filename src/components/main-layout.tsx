import Image from "next/image";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import ModeToggle from "@/components/ModeToggle";
import logo from "@/assets/lcaLogo.svg";

export default function MainLayout() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex items-center border-b w-full py-4">
        <div className="flex items-center px-8">
          {/* Specify explicit dimensions for the image wrapper and use relative positioning */}
          <div className="relative w-16 h-9 md:w-20 md:h-11 lg:w-24 lg:h-13">
            <Image
              src={logo}
              layout="fill"
              objectFit="contain"
              alt="LCA logo"
            />
          </div>
        </div>
        <MainNav className="mx-6" />
        {/* Container for ModeToggle and UserNav */}
        <div className="ml-auto flex items-center space-x-4 pr-8">
          {/* ModeToggle is to the left */}
          <ModeToggle />
          {/* UserNav is to the right */}
          <UserNav />
        </div>
      </div>
    </div>
  );
}
