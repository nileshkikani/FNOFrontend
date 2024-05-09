"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

//--------HOOKS---------------
import useCashflowData from "@/hooks/useCashflowData";

//-----GRAPH COMPONENTS----------
const MoneyFlowGraph = dynamic(() =>
  import("@/component/MoneyFlow-Graphs/MoneyFlow-Graph")
);
import { useAppSelector } from "@/store";
// import ActiveMoneyFlow from "@/component/MoneyFlow-Graphs/ActiveMoneyFlow-Graph";

//  ===========LOADING ANIMATION ===========
// const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"));

const Page = () => {
  const {
    // isLoading,
    getData,
    data,
    alldate,
    uniqueSymbolData,
    selectedStock,
    currentSelectedDate,
    dispatch,
    // filterByStockAndDate
    handleDateDropdown,
    dateWiseFilter,
    uniqueDates,
  } = useCashflowData();
  const authState = useAppSelector((state) => state.auth.authState);

  useEffect(() => {
    authState && getData();
  }, [authState]);

  const filterByStockAndDate = (event, isDateDropdown) => {
    if (isDateDropdown) {
      const d = event.target.value;
      getData(d);
    } else {
      const symbl = event.target.value;
      const finalData = data.filter((itm) => itm.symbol === symbl);
      dispatch({ type: "SET_SELECTED_STOCK", payload: finalData });
    }
  };

  return (
    <>
          {/* -----------------------DATE DROPDOWN------------------- */}
          <h1 className="table-title">SELECT DATE</h1>
      <select
        onChange={(e) => filterByStockAndDate(e, true)}
        value={currentSelectedDate}
        className="stock-dropdown"
      >
        <option disabled selected value>
          select date
        </option>
        {alldate?.map((stockData, index) => (
          <option key={index} value={stockData}>
            {stockData}
          </option>
        ))}
      </select>
      {/* -------------------STOCK DROPDOWN---------------------- */}
      <h1 className="table-title">SELECT SCRIPT</h1>
      <select
        onChange={(e) => filterByStockAndDate(e, false)}
        className="stock-dropdown"
      >
        <option disabled selected value>
          select stock
        </option>
        {uniqueSymbolData.map((stockData, index) => (
          <option key={index} value={stockData[0]?.symbol}>
            {stockData[0]?.symbol}
          </option>
        ))}
      </select>
      <div>
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
                    Money Flow
                    <span className="in-thousand">in thousand</span>
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
      {/* <div className="graph-div"> <MoneyFlowGraph /> </div> */}
    </>
  );
};

export default Page;
