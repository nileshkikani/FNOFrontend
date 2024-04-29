"use client"
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import Login from '@/component/Login';

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   router.push('/activeoi');
  // }, []);

  return (
    <div>
      <Login/>
    </div>
  );
}
