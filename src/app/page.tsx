import Image from "next/image";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import ModeToggle from "@/components/ModeToggle";
import logo from "@/assets/lcaLogo.svg";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex items-center border-b w-full py-4">
        <div className="flex items-center px-8">
          <Image src={logo} width={64} height={36} alt="LCA logo" />
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
