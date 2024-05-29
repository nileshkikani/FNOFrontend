'use client';
import React, { useEffect, useState } from 'react';
import './global.css';

//---------CHARTS-----------
import MultiStrikeChart from '@/component/MultiStrikeChart/MultiStrikeChart';
import useMultiStrikeData from '@/hooks/useMultiStrikeData';

const Page = () => {
  const { strikes, checkSelectedStrike, multiStrikeAPiCall,selectedStrikePrices } = useMultiStrikeData();
  // const [isInitiallyChecked, setIsInitiallyChecked] = useState(false);

  useEffect(() => {
    multiStrikeAPiCall();
  }, []);

  useEffect(() => {
    if (strikes.length > 0) {
      const thirdCheckboxValue = strikes[2];
      checkSelectedStrike({ target: { value: thirdCheckboxValue, checked: true } }, 3);
    }
  }, [strikes]);


  return (
    <>
     <div className="checkbox-container">
        {strikes.map((itm, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`strike${index}`}
              value={itm}
              checked={selectedStrikePrices.includes(itm)}
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
