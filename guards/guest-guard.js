"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";

const GuestGuard = ({ children }) => {
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth.authState);

  useEffect(() => {
    if (authState && authState.access && authState.refresh) {
      router.push(`${window.location.pathname}`); 
    } else {
      router.push('/login'); 
    } 
  }, [router]);

  return <>{children}</>;
};

export default GuestGuard;
