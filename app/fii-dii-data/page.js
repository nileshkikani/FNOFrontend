"use client";
import React from "react";

// ---------COMPONENTS-------
// import TotalData from "@/component/totaldata";
import FileImport from "@/component/fileimport";

// ------------HOOKS----------
import useFiiDiiData from "@/hooks/useFiiDiiData";

//---------CHARTS-----------
import OptionsDataGraph from "@/component/FII-DII-Graphs/OptionsData-Graph";
import FuturesDataGraph from "@/component/FII-DII-Graphs/FuturesData-Graph";

export default function Page() {
  const { checkClientType } = useFiiDiiData();
  return (
    <>
      <FileImport />
      <div>
        <select onChange={checkClientType}>
          <option value="FII">FII</option>
          <option value="DII">DII</option>
          <option value="Pro">Pro</option>
          <option value="Client">Client</option>
        </select>
      </div>
      <div className="graph-div">
        <OptionsDataGraph />
      </div>
      <div className="graph-div">
        <FuturesDataGraph />
      </div>
      {/* <TotalData /> */}
    </>
  );
}
