"use client";
import React from "react";

//---------CHARTS-----------
import MultiStrikeChart from "@/component/MultiStrikeChart";
import useMultiStrikeData from "@/hooks/useMultiStrikeData";

const Page = () => {
  const { strikes, setStrikeDate } = useMultiStrikeData();
  return (
    <>
      <div>
        {strikes.map((itm, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`strike${index}`}
              value={itm}
              onChange={setStrikeDate}
            />
            <label htmlFor={`strike${index}`}>{itm}</label>
          </div>
        ))}
      </div>
      <MultiStrikeChart />
    </>
  );
};

export default Page;
