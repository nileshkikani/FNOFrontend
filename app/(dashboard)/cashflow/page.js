"use client";
import React,{useEffect} from "react";
import dynamic from "next/dynamic";

//--------HOOKS---------------
import useCashflowData from "@/hooks/useCashflowData";


//-----GRAPH COMPONENTS----------
import MoneyFlowGraph from "@/component/MoneyFlow-Graphs/MoneyFlow-Graph";
// import ActiveMoneyFlow from "@/component/MoneyFlow-Graphs/ActiveMoneyFlow-Graph";

//  ===========LOADING ANIMATION ===========
const ClipLoader = dynamic(() => import("react-spinners/ClipLoader"));

const Page = () => {
  const {
    isLoading,
    getData,
    handleStockDropdown,
    uniqueSymbolData,
    handleDateDropdown,
    dateWiseFilter,
    uniqueDates,
    selectedStock
  } = useCashflowData();

  useEffect(() => {
    getData();
  }, []);


  return (
    <>
      {/* <div>
        <ActiveMoneyFlow />
      </div> */}
      <div className="main-div">
        <div>
          {/* ----SELECT STOCK DROPDOWN-------- */}
          <h1 className="table-title">SELECT SCRIPT</h1>
          <select
            onChange={handleStockDropdown}
            className="stock-dropdown"
          >
            <option disabled selected value>
            select stock</option>
            {uniqueSymbolData.map((stockData, index) => (
              <option key={index} value={stockData[0]?.symbol}>
                {stockData[0]?.symbol}
              </option>
            ))}
          </select>
        </div>
        <div>
          {isLoading && <div className="loading">Loading data...</div>}
          {selectedStock && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Close</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Average</th>
                    <th>
                      Volume<span className="in-thousand">in thousand</span>
                    </th>
                    <th>
                      Money Flow<span className="in-thousand">in thousand</span>
                    </th>
                    <th>
                      Net Money Flow
                      <span className="in-thousand">in thousand</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStock
                    .slice()
                    .reverse()
                    .map((item) => (
                      <tr key={item?.id}>
                        <td>{item?.time}</td>
                        <td>{item?.close}</td>
                        <td>{item?.open}</td>
                        <td>{item?.high}</td>
                        <td>{item?.low}</td>
                        <td>{item?.average}</td>
                        <td>{item?.volume}</td>
                        <td>{item?.money_flow}</td>
                        <td>{item?.net_money_flow}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div>
        <MoneyFlowGraph />
      </div>
    </>
  );
};

export default Page;
