"use client";
import React from "react";

//--------HOOKS---------------
import useCashflowData from "@/hooks/useCashflowData";

//-----GRAPH COMPONENTS----------
import MoneyFlowGraph from "@/component/MoneyFlow-Graphs/MoneyFlow-Graph";
import ActiveMoneyFlow from "@/component/MoneyFlow-Graphs/ActiveMoneyFlow-Graph";

const Page = () => {
  const {
    isLoading,
    handleDropdownChange,
    uniqueSymbolData,
    selectedStock,
    handleDateDropdown,
    selectedDate,
    uniqueDates,
    selectedStockData,
    data,
  } = useCashflowData();

  // const finalData = selectedStockData.filter()

  return (
    <>
      {/* <div>
        <ActiveMoneyFlow />
      </div> */}
      <div className="main-div">
        <div>
          {/* ----SELECT STOCK DROPDOWN-------- */}
          <h1 className="table-title">STOCK</h1>
          <select
            value={selectedStock}
            onChange={handleDropdownChange}
            className="stock-dropdown"
          >
            <option value="">Select a stock</option>
            {uniqueSymbolData.map((stockData, index) => (
              <option key={index} value={stockData[0]?.symbol}>
                {stockData[0]?.symbol}
              </option>
            ))}
          </select>
          <h1 className="table-title">DATE</h1>
          <select
            value={selectedDate}
            onChange={handleDateDropdown}
            className="stock-dropdown"
          >
            {uniqueDates.map((date, index) => (
              <option key={index} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          {isLoading && <div className="loading">Loading data...</div>}
          {selectedStockData && (
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
                  {selectedStockData
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
