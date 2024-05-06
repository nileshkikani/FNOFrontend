"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();
  // const { isLoggedIn } = useAuth();
  const getAccessCookie = Cookies.get("access");
  const getRefreshCookie = Cookies.get("refresh");

  useEffect(() => {
    if (!getAccessCookie && !getRefreshCookie) {
      router.push("/login");
    }
  }, []);

  return <div>{/* your home page content */}</div>;
}
