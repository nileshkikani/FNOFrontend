"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const GuestGuard = ({ children }) => {
  // const [isCookieFound, setIsCookieFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const accessCookie = Cookies.get("access");
    const refreshCookie = Cookies.get("refresh");

    if (accessCookie && refreshCookie) {
      // console.log("Access Cookie:", accessCookie);
      // console.log("Refresh Cookie:", refreshCookie);
      // setIsCookieFound(true);
      router.push('/activeoi'); 
    } else {
      // console.log("Access or Refresh Cookie not found");
      // setIsCookieFound(false);
      router.push('/login'); 
    }
  }, [router]);

  return <>{children}</>;
};

export default GuestGuard;


