import React, { useEffect, useState } from "react";
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
import { auth, db } from "../firebase"; // Assuming db is your Firestore instance
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import { Spinner } from "@nextui-org/react";

export default function PageNavbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const { firstName, lastName } = JSON.parse(storedUserInfo);
          setName(`${firstName} ${lastName}`);
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
      navigate("/login");
      setName(""); // Reset name on logout
    } catch (err) {
      console.error(err);
    }
  };

  const linkToSettings = () => {
    navigate("/settings");
  };

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
        <Link to="/" className="flex items-center">
          {" "}
          {/* Add flex and items-center classes */}
          <img className="image-logo" src={logo} alt="LCA logo" />
          <span className="font-bold text-inherit ml-2">
            Peer Tutoring
          </span>{" "}
          {/* Adjust margin as needed */}
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
          {loading ? (
            // Show Chakra UI Spinner while loading
            <Spinner size="md" color="blue.500" />
          ) : user ? (
            // Show avatar with dropdown if user is logged in
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar size="md" name={name} src="" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="account" onClick={linkToSettings}>
                  My Account
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={logOut}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            // User is not logged in, show login button
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
