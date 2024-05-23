"use client"
import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';



const Page = () => {
  const router = useRouter();

  useEffect(()=>{
    router.push("/fii-dii-data/fno");
   },[])



  return (
    <>

    </>
  );
};

export default Page;
