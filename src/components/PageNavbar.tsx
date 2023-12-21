import "./Navbar.css";
import logo from "../assets/logo.svg";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import * as Avatar from "@radix-ui/react-avatar";

export default function PageNavbar() {
  let profile = null;
  try {
    profile = JSON.parse(localStorage.getItem("user_data"));
  } catch (error) {
    console.error("Error parsing user data from local storage:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("user_data");
  }
  let userImage = null;
  try {
    userImage = localStorage.getItem("user_image");
  } catch (error) {
    console.error("Error retrieving user image from local storage:", error);
  }

  const logOut = () => {
    googleLogout();
    localStorage.removeItem("user");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_image");
    window.location.reload(); // Automatically update the page after user logs out
  };

  const navigate = useNavigate();

  return (
    <Navbar
      isBordered
      isBlurred={false}
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarBrand>
        <Link to="/">
          <img className="image-logo" src={logo} alt="LCA logo"></img>
          <p className="font-bold text-inherit mt-4 title">Peer Tutoring</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem isActive={window.location.pathname === "/calendar"}>
          <Link
            to="/calendar"
            className={
              window.location.pathname === "/calendar" ? "text-blue-500" : ""
            }
          >
            Calendar
          </Link>
        </NavbarItem>
        <NavbarItem isActive={window.location.pathname === "/"}>
          <Link
            to="/"
            className={window.location.pathname === "/" ? "text-blue-500" : ""}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={window.location.pathname === "/help"}>
          <Link
            to="/help"
            className={
              window.location.pathname === "/help" ? "text-blue-500" : ""
            }
          >
            Help
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {userImage ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar.Root className="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
                  <Avatar.Image
                    className="h-full w-full rounded-[inherit] object-cover border-solid border-4"
                    src={userImage}
                    alt="Google Profile image"
                  />
                  <Avatar.Fallback
                    className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium border-dotted border-2"
                    delayMs={600}
                  >
                    {profile.given_name}
                  </Avatar.Fallback>
                </Avatar.Root>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{profile.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  onClick={() => navigate("/settings")}
                >
                  My Settings
                </DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={logOut}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button id="buttons" color="primary" variant="flat">
                Login
              </Button>
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
