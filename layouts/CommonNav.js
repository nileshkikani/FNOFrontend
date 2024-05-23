'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CommonNav = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="fii-dii-header">
        <button className={pathname === '/fii-dii-data/fno' ? 'fii-dii-header-active' : 'fii-dii-header-deactive'}>
          <Link href={'/fii-dii-data/fno'}>Futures and Options</Link>
        </button>
        <button
          className={pathname === '/fii-dii-data/cash-market' ? 'fii-dii-header-active' : 'fii-dii-header-deactive'}
        >
          <Link href={'/fii-dii-data/cash-market'}>Cash Market</Link>
        </button>
      </div>
    </>
  );
};

export default CommonNav;
