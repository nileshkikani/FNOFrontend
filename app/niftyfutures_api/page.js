"use client";
import React from "react";
import useNiftyFutureData from "@/hooks/useNiftyFutureData";

//--------GRAPH COMPONENTS--------
import NiftyFuturesGraph from "@/component/NiftyFutures-Graphs/NiftyFuturesGraph"
// import NiftyFuturesClosePrice from "@/component/NiftyFutures-Graphs/NiftyFuturesClosePriceGraph"


export default function Page() {
  const {
    data,
    isLoading,
    selectedOption,
    setSelectedOption,
    selectedDate,
    setSelectedDate,
    setUniqueDatesArray,
    uniqueDatesArray,
    reversedFilteredData
  } = useNiftyFutureData();

  const handleExpiryChange = (event) => {
    const myExpiry = event.target.value;
    setSelectedOption(myExpiry);

    const filteredData = data.filter((item) => item.expiration === myExpiry);

    const uniqueDatesSet = new Set();
    filteredData.forEach((item) => {
      const date = new Date(item.created_at).toLocaleDateString();
      uniqueDatesSet.add(date);
    });
    setUniqueDatesArray(Array.from(uniqueDatesSet));
  };
  
  const handleDateChange = (event) => {
    const myDate = event.target.value;
    setSelectedDate(myDate);
  };

  const expiry = data.slice(0, 3);

  return (
    <>
      <div className="main-div">
        <div className="mx-10">
          <h1 className="table-title">NIFTY FUTURES</h1>
          <div>
            {/* ----EXPIRY DROPDOWN-------- */}
            <h1 className="table-title">EXPIRY</h1>
            <select value={selectedOption} onChange={handleExpiryChange}>
              {expiry.map((item, index) => (
                <option key={index} value={item.expiration}>
                  {item.expiration}
                </option>
              ))}
            </select>
          </div>
          <div>
            {/* ------CREATED AT DROPDOWN-------- */}
            <h1 className="table-title">CREATED AT</h1>
            <select value={selectedDate} onChange={handleDateChange}>
              {uniqueDatesArray.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <div>
              <h1>{data.instrument_type}</h1>
              <table>
                <thead>
                  <tr>
                    <th>Expiry</th>
                    <th>OI</th>
                    <th>Change in OI</th>
                    <th>
                      Percentage <br></br> Change in OI
                    </th>
                    <th>VWAP</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {reversedFilteredData?.map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.expiration}</td>
                      <td>{item?.open_interest}</td>
                      <td>{item?.change_in_open_interest}</td>
                      <td>{item?.percentage_change_in_open_interest}</td>
                      <td>{item?.vwap}</td>
                      <td>{new Date(item?.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="main-div">
        <NiftyFuturesGraph />
      </div>
      {/* <div className="main-div">
        <NiftyFuturesClosePrice />
      </div> */}
    </>
  );
}
