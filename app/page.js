"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {

    const isLoggedIn = false;

    if (!isLoggedIn) {
      router.push('/login'); 
    }
  }, []);

  return (
    <div>
      {/* your home page content */}
    </div>
  );
}
