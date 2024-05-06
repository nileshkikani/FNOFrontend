"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useAuth from "@/hooks/useAuth";

const GuestGuard = ({ children }) => {

  const router = useRouter();
  const {isLoggedIn} = useAuth();

  useEffect(() => {
    const accessCookie = Cookies.get("access");
    const refreshCookie = Cookies.get("refresh");

    if (isLoggedIn && accessCookie && refreshCookie) {
      router.push('/activeoi'); 
    } else {
      router.push('/login'); 
    }
  }, [router]);

  return <>{children}</>;
};

export default GuestGuard;


