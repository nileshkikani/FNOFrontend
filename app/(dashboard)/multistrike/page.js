'use client';
import React, { useEffect } from 'react';
import './global.css';

//---------CHARTS-----------
import MultiStrikeChart from '@/component/MultiStrikeChart/MultiStrikeChart';
import useMultiStrikeData from '@/hooks/useMultiStrikeData';

const Page = () => {
  const { strikes, checkSelectedStrike, multiStrikeAPiCall, checkedStrikes } = useMultiStrikeData();

  useEffect(() => {
    multiStrikeAPiCall();
  }, []);
  return (
    <>
      <div className="checkbox-container">
        {strikes.map((itm, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`strike${index}`}
              value={itm}
              onChange={(e) => checkSelectedStrike(e, index + 1)}
            />
            <label htmlFor={`strike${index}`}>{`${itm}`}</label>
            <span className={`color-dot color-dot-${index}`}></span>
            <br />
          </div>
        ))}
      </div>
      <MultiStrikeChart />
    </>
  );
};

export default Page;
