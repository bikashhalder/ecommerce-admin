"use client";
import { signOut } from "next-auth/react";
import React from "react";

const Logout = () => {
  return <div onClick={() => signOut()}>Logout</div>;
};

export default Logout;
