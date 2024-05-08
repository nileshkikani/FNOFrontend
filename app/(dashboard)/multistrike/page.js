"use client";
import React,{useEffect} from "react";

//---------CHARTS-----------
import MultiStrikeChart from "@/component/MultiStrikeChart";
import useMultiStrikeData from "@/hooks/useMultiStrikeData";

const Page = () => {
  const { strikes, setStrikeDate,multiStrikeAPiCall,selectedStrikes } = useMultiStrikeData();

  useEffect(() => {
    multiStrikeAPiCall();
  }, []);

  return (
    <>
      <div>
        {strikes.map((itm, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`strike${index}`}
              value={`${itm}`}
              onChange={setStrikeDate}
            />
            <label htmlFor={`strike${index}`}>{`${itm}`}</label>
             <br/>
            {/* <input
              type="checkbox"
              id={`strike${index}PE`}
              value={`${itm}`}
              onChange={setStrikeDate}
            />
            <label htmlFor={`strike${index}PE`}>{`${itm}PE`}</label> */}
          </div>
        ))}
      </div>
      <MultiStrikeChart />
    </>
  );
};

export default Page;
