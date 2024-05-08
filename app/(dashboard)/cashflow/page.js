"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";

//--------HOOKS---------------
import useCashflowData from "@/hooks/useCashflowData";

//-----GRAPH COMPONENTS----------
const MoneyFlowGraph = dynamic(() =>
  import("@/component/MoneyFlow-Graphs/MoneyFlow-Graph")
);
// import ActiveMoneyFlow from "@/component/MoneyFlow-Graphs/ActiveMoneyFlow-Graph";

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"));

const Page = () => {
  const {
    isLoading,
    getData,
    handleStockDropdown,
    uniqueSymbolData,
    selectedStock,
  } = useCashflowData();

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="main-div">
          {/* ----SELECT STOCK DROPDOWN-------- */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "50px",
            }}
          >
            <PropagateLoader color="#33a3e3" loading={isLoading} size={15} />
          </div>
        </div>
      ) : (
        <>
          <h1 className="table-title">SELECT SCRIPT</h1>
          <select onChange={handleStockDropdown} className="stock-dropdown">
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
          <div className="graph-div">
          <MoneyFlowGraph/>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
