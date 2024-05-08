"use client";
import React,{useEffect} from "react";
import useNiftyFutureData from "@/hooks/useNiftyFutureData";
import dynamic from "next/dynamic";



//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"));
//--------GRAPH COMPONENTS--------
const NiftyFuturesGraph = dynamic(() =>
  import("@/component/NiftyFutures-Graphs/NiftyFuturesGraph")
);
// import NiftyFuturesClosePrice from "@/component/NiftyFutures-Graphs/NiftyFuturesClosePriceGraph"

export default function Page() {


  const {
    apiData,
    isLoading,
    getData,
    selectedOption,
    selectedDate,
    uniqueExpiryDatesArray,
    // reversedFilteredData,
    filterByCreatedDate,
    handleDateChange,
    uniqueCreatedDatesArray,
    handleExpiryChange,
  } = useNiftyFutureData();

  useEffect(() => {
    getData();
}, []);

  

return (
  <>
    {!selectedOption ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <PropagateLoader
          color="#33a3e3"
          loading={!selectedOption}
          size={15}
        />
      </div>
    ) : (
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
          </div>
        </div>
        <div className="main-div">
          <NiftyFuturesGraph />
        </div>
      </>
    )}
  </>
);

}
