import React from "react";
// -----------------------HOOKS------------------
import useNiftyFutureData from "@/hooks/useNiftyFutureData";

const NiftyFuturesTable = () => {
    const {
        apiData,
        // selectedOption,
        uniqueExpiryDatesArray,
        filterByCreatedDate,
        handleDateChange,
        uniqueCreatedDatesArray,
        handleExpiryChange,
      } = useNiftyFutureData();


      // console.log("selected optionnn--chekc--,",selectedOption);
      // console.log("data on tablee===",filterByCreatedDate)
  return (
    <>
      <div className="mx-10">
        <h1 className="table-title">NIFTY FUTURES</h1>
        <div className="expiry-created-date">
          <div className="expirydate-div">
            {/* --------------EXPIRY DROPDOWN-------- */}
            <h1 className="table-title">EXPIRY</h1>
            <select
              // value={selectedOption}
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
                // value={selectedDate}
                className="stock-dropdown"
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
              {filterByCreatedDate?.map((item) => (
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
    </>
  );
};

export default NiftyFuturesTable;
