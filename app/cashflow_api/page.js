"use client";
import React from "react";
import useCashflowData from "@/hooks/useCashflowData";

const page = () => {
  const {
    isLoading,
    handleDropdownChange,
    uniqueSymbolData,
    selectedStock,
    selectedStockData,
  } = useCashflowData();

  return (
    <>
      <div className="main-div">
        <div>
          {/* ----SELECT STOCK DROPDOWN-------- */}
          <h1 className="table-title">STOCK</h1>
          <select value={selectedStock} onChange={handleDropdownChange}>
            <option value="">Select a stock</option>
            {uniqueSymbolData.map((stockData, index) => (
              <option key={index} value={stockData[0]?.symbol}>
                {stockData[0]?.symbol.slice(0, -3)}
              </option>
            ))}
          </select>
        </div>
        <div>
          {isLoading && (
            <div className="loading">Loading data...</div>
          ) }
          { selectedStockData && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Time</th>
                    <th>Close</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Average</th>
                    <th>Volume</th>
                    <th>Money Flow</th>
                    <th>Net Money Flow</th>
                    <th>Created at</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStockData.map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.symbol.slice(0, -3)}</td>
                      <td>{item?.time}</td>
                      <td>{item?.close}</td>
                      <td>{item?.open}</td>
                      <td>{item?.high}</td>
                      <td>{item?.low}</td>
                      <td>{item?.average}</td>
                      <td>{item?.volume}</td>
                      <td>{item?.money_flow}</td>
                      <td>{item?.net_money_flow}</td>
                      <td>{new Date(item?.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) }
        </div>
      </div>
    </>
  );
};

export default page;
