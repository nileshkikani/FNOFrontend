"use client"
import CommonNav from "@/layouts/CommonNav";
export default function Layout({ children }) {
  return (
    <>
      <CommonNav/>
        {children}
    </>
  );
}