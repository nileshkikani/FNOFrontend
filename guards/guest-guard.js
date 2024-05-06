"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const GuestGuard = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const accessCookie = Cookies.get("access");
    const refreshCookie = Cookies.get("refresh");
    
    if (accessCookie && refreshCookie) {
      router.push(`${window.location.pathname}`); 
    } else {
      router.push('/login'); 
    } 
  }, [router]);

  return <>{children}</>;
};

export default GuestGuard;
