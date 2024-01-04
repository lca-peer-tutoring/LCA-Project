// "use client";

// import { useState } from "react";
// import React from "react";
// import MainLayout from "../../___layout/MainLayout";
// import { auth, db } from "../../firebase";
// import {
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail,
//   signInWithEmailAndPassword,
// } from "firebase/auth";
// import { Input, Button } from "@nextui-org/react";
// import { EyeFilledIcon } from "../../public/EyeFilledIcon";
// import { EyeSlashFilledIcon } from "../../public/EyeSlashFilledIcon";
// import { useNavigate } from "react-router-dom";
// import closeIcon from "../public/closeIcon.svg";
// import {
//   doc,
//   setDoc,
//   query,
//   getDocs,
//   collection,
//   where,
// } from "firebase/firestore";

// export const LoginPage = () => {
//   const [isVisible, setIsVisible] = React.useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [alert, setAlert] = useState({ type: "", message: "" });
//   const [username] = email.split("@");
//   const [firstName, lastName] = username.split(".");
//   const navigate = useNavigate(); //
//   const toggleVisibility = () => setIsVisible(!isVisible);

//   // Function to display alerts
//   const showAlert = (type, message) => {
//     setAlert({ type, message });
//   };

//   // Function to hide alerts
//   const hideAlert = () => {
//     setAlert({ type: "", message: "" });
//   };

//   const signUp = async () => {
//     try {
//       // Check if email address is from the allowed domain
//       if (email.endsWith("@lca.edu")) {
//         // Check if user already exists in Firestore

//         // Proceed with signup if user doesn't exist
//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );
//         const user = userCredential.user;

//         // Create a user document in Firestore
//         const userDocRef = doc(db, "users", user.uid);
//         await setDoc(userDocRef, {
//           firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
//           lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
//           email: email,
//           userId: user.uid,
//         });

//         localStorage.setItem(
//           "userInfo",
//           JSON.stringify({
//             firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
//             lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
//             email: email,
//             userId: user.uid,
//           })
//         );

//         navigate("/"); // Navigate to home page after successful signup
//       } else {
//         // Email address is not from the allowed domain, show an error message
//         showAlert(
//           "danger",
//           "Only email addresses from @lca.edu domain are allowed."
//         );
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("danger", "Email already in use."); // Show error alert
//     }
//   };

//   const logIn = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       if (userCredential) {
//         const user = userCredential.user;

//         // Store user information in local storage after successful login
//         localStorage.setItem(
//           "userInfo",
//           JSON.stringify({
//             email: user.email, // Email from user credential
//             userId: user.uid, // User ID from user credential
//             firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
//             lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
//           })
//         );

//         navigate("/"); // Navigate to home page after successful login
//       }
//     } catch (err) {
//       showAlert("danger", "Invalid email or password."); // Show error alert
//     }
//   };

//   const resetPassword = async () => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//       showAlert("success", "Reset password email has been sent."); // Show success alert
//     } catch (err) {
//       showAlert("danger", "Invalid email."); // Show error alert
//     }
//   };

//   return (
//     <MainLayout>
//       {alert.message && (
//         <div
//           className={`alert alert-${alert.type} d-flex justify-content-between align-items-center`}
//           role="alert"
//           style={{ maxWidth: "600px", margin: "0 auto" }}
//         >
//           {alert.message}
//           <Button
//             isIconOnly
//             color="danger"
//             variant="faded"
//             size="sm"
//             aria-label="Close"
//             onPress={hideAlert}
//           >
//             <img className="image-logo" src={closeIcon.src} alt="Close" />
//           </Button>
//         </div>
//       )}
//       <div className="flex flex-col w-full h-full justify-center items-center pt-4">
//         <Input
//           isRequired
//           type="email"
//           label="Email"
//           variant="bordered"
//           className="max-w-xs mb-4"
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Input
//           isRequired
//           label="Password"
//           variant="bordered"
//           placeholder="Enter your password"
//           onChange={(e) => setPassword(e.target.value)}
//           endContent={
//             <button
//               className="focus:outline-none"
//               type="button"
//               onClick={toggleVisibility}
//             >
//               {isVisible ? (
//                 <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
//               ) : (
//                 <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
//               )}
//             </button>
//           }
//           type={isVisible ? "text" : "password"}
//           className="max-w-xs mb-4"
//         />
//         <Button
//           variant="ghost"
//           color="primary"
//           size="lg"
//           onClick={logIn}
//           className="mx-auto mb-4"
//         >
//           {" "}
//           Log In
//         </Button>
//         <Button
//           variant="ghost"
//           color="primary"
//           size="lg"
//           onClick={signUp}
//           className="mx-auto mb-4"
//         >
//           {" "}
//           Sign Up
//         </Button>
//         <Button
//           variant="ghost"
//           color="primary"
//           size="lg"
//           onClick={resetPassword}
//           className="mx-auto mb-4"
//         >
//           {" "}
//           Reset Password
//         </Button>
//       </div>
//     </MainLayout>
//   );
// };

// export default LoginPage;

"use client";

import Image from "next/image";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import logo from "@/assets/lcaLogo.svg";
import AccountPage from "./components/account";
import MainLayout from "@/components/main-layout";

export default function LoginPage() {
  return (
    <>
      <MainLayout />
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign In With Your Email
              </h1>
            </div>
            <AccountPage />
          </div>
        </div>
      </div>
    </>
  );
}
