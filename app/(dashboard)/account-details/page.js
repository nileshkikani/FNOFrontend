"use client"
import React from 'react';
import { useAppSelector } from '@/store';

const Page = () => {
  const userEmail = useAppSelector((state) => state.user.userEmail);

  return (
    <>
      <label>Email address: {userEmail}</label>
    </>
  );
};

export default Page;
