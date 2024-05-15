"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";

const GuestGuard = ({ children }) => {
  const router = useRouter();
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

  useEffect(() => {
    if (checkUserIsLoggedIn) {
      router.push(`${window.location.pathname}`); 
    } else {
      router.push('/login'); 
    } 
  }, [router]);

  return <>{children}</>;
};

export default GuestGuard;
