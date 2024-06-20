'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MultistrikeCommonNav = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="multistrike-header">
        <button className={pathname === '/multistrike/multistrike-oi' ? 'multistrike-header-active' : 'multistrike-header-deactive'}>
          <Link href={'/multistrike/multistrike-oi'}>Multistrike OI</Link>
        </button>
        <button
          className={pathname === '/multistrike/most-active' ? 'multistrike-header-active' : 'multistrike-header-deactive'}
        >
          <Link href={'/multistrike/most-active'}>Most Active OI</Link>
        </button>
      </div>
    </>
  );
};

export default MultistrikeCommonNav;
