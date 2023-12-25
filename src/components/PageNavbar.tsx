import { useEffect, useState } from "react";
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
  Avatar,
} from "@nextui-org/react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function PageNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
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
        <Link to="/">
          <img className="image-logo" src={logo} alt="LCA logo" />
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
          {user ? (
            // User is logged in, show avatar with dropdown
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  src={user.photoURL || "https://placeholder"}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
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
