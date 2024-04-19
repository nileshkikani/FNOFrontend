"use client"
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/activeoi');
  }, []);

  return (
    <div>
      <p>Redirecting to activeoi...</p>
    </div>
  );
}
