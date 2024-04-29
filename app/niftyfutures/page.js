"use client";
import React from "react";
import useNiftyFutureData from "@/hooks/useNiftyFutureData";
import useAuth from "@/hooks/useAuth"
import { redirect } from 'next/navigation'

//--------GRAPH COMPONENTS--------
import NiftyFuturesGraph from "@/component/NiftyFutures-Graphs/NiftyFuturesGraph";
// import NiftyFuturesClosePrice from "@/component/NiftyFutures-Graphs/NiftyFuturesClosePriceGraph"

export default function Page() {
  // const {isLoggedIn} =useAuth()
  // if(!isLoggedIn){
  //   // alert("login first");
  //   redirect("/");
  // }

  const {
    apiData,
    isLoading,
    selectedOption,
    selectedDate,
    uniqueExpiryDatesArray,
    // reversedFilteredData,
    filterByCreatedDate,
    handleDateChange,
    uniqueCreatedDatesArray,
    handleExpiryChange,
  } = useNiftyFutureData();

  


  return (
    <>
      <div className="main-div">
        <div className="mx-10">
          <h1 className="table-title">NIFTY FUTURES</h1>
          <div className="expiry-created-date">
            <div className="expirydate-div">
              {/* --------------EXPIRY DROPDOWN-------- */}
              <h1 className="table-title">EXPIRY</h1>
              <select
                value={selectedOption}
                onChange={handleExpiryChange}
                className="stock-dropdown"
              >
                {uniqueExpiryDatesArray?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="expirydate-div">
            {/* --------------DATE DROPDOWN---------- */}
            <h1 className="table-title">DATE</h1>
            {uniqueCreatedDatesArray && (
              <select
                value={selectedDate}
                className="stock-dropdown "
                onChange={handleDateChange}
              >
                {uniqueCreatedDatesArray.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            )}
            </div>
          </div>
          {isLoading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <div>
              <h1>{apiData?.instrument_type}</h1>
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
                  {filterByCreatedDate.reverse()?.map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.expiration}</td>
                      <td>{item?.open_interest}</td>
                      <td>{item?.change_in_open_interest}</td>
                      <td>{item?.percentage_change_in_open_interest}</td>
                      <td>{item?.vwap}</td>
                      <td>
                        {new Date(item?.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
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
