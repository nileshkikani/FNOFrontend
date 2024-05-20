'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NAVDATA = [
  {
    path: '/fii-dii-data/fno',
    title: 'Futures and Options'
  },
  {
    path: '/fii-dii-data/cash-market',
    title: 'Cash Market'
  }
];

const CommonNav = () => {
  const router = useRouter();
  return (
    <>
      <ul className="fii-dii-header">
        {NAVDATA.map((item) => (
          <li key={item.path} className={router.pathname === item.path ? 'fii-dii-header-li-active' : ''}>
            <Link href={item.path}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CommonNav;
