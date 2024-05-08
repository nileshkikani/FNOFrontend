"use client";
import React,{useEffect} from "react";

// ------------HOOKS----------
import useFiiDiiData from "@/hooks/useFiiDiiData";

//---------CHARTS-----------
import DailyIndexOption from "@/component/FII-DII-Graphs/DailyIndexOption-Graph";
import DailyIndexFutures from "@/component/FII-DII-Graphs/DailyIndexFutures-Graph"

import OptionsDataGraph from "@/component/FII-DII-Graphs/OptionsData-Graph";
import FuturesDataGraph from "@/component/FII-DII-Graphs/FuturesData-Graph";


export default function Page() {
  const { checkClientType,handleFetch } = useFiiDiiData();

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <>
      {/* <FileImport /> */}
      <div>
        <select onChange={checkClientType}>
          <option value="FII">FII</option>
          <option value="DII">DII</option>
          <option value="Pro">Pro</option>
          <option value="Client">Client</option>
        </select>
      </div>
      <div className="fii-dii-graph-div">
        <DailyIndexOption />
      </div>
      <div className="fii-dii-graph-div">
        <DailyIndexFutures />
      </div>
      <div className="fii-dii-graph-div">
        <OptionsDataGraph />
      </div>
      <div className="fii-dii-graph-div">
        <FuturesDataGraph />
      </div>
    </>
  );
}
