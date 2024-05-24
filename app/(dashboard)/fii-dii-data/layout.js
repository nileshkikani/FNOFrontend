"use client"
import CommonNav from "@/layouts/CommonNav";
import './global.css';
export default function Layout({ children }) {
  return (
    <>
      <CommonNav/>
        {children}
    </>
  );
}