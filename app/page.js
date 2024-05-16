'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/store';

export default function Home() {
  const router = useRouter();
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);


  useEffect(() => {
    if (!checkUserIsLoggedIn) {
      router.push('/login');
    } 
    else {
       router.push('/activeoi'); 
    }
  }, []);

  return <div>{/* your home page content */}</div>;
}
