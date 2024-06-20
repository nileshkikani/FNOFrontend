"use client"
import MultistrikeCommonNav from '@/layouts/MultistrikeCommonNav';
import './global.css';
export default function Layout({ children }) {
  return (
    <>
      <MultistrikeCommonNav/>
        {children}
    </>
  );
}