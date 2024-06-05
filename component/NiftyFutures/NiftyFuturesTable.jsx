import React from "react";
// -----------------------HOOKS------------------

const NiftyFuturesTable = ({selectedNiftyFuturesExpDates,setSelectedNiftyFuturesExpDates ,niftyFuturesExpDates,niftyFuturesFilterData,niftyFuturesDate,setSelectedNiftyFutureDates,selectedNiftyFutureDates}) => {
  
  return (
    <>
      <div>
        <h1 className="table-title">NIFTY FUTURES</h1>
        <div className="expiry-created-date">
          <div className="expirydate-div">
            {/* --------------EXPIRY DROPDOWN-------- */}
            <h1 className="table-title-beta">EXPIRY :</h1>
            <select
              value={selectedNiftyFuturesExpDates}
              onChange={(e)=>setSelectedNiftyFuturesExpDates(e.target.value)}
              className="stock-dropdown"
            >
              {niftyFuturesExpDates && niftyFuturesExpDates?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="expirydate-div">
            {/* --------------DATE DROPDOWN---------- */}
            <h1 className="table-title-beta">DATE :</h1>
            {niftyFuturesDate && (
              <select
              value={selectedNiftyFutureDates}
                className="stock-dropdown"
                onChange={(e)=>setSelectedNiftyFutureDates(e.target.value)}
              >
                {niftyFuturesDate?.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="table-container1">
          <table className="table1">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Expiry</th>
                <th className="table-header-cell">OI</th>
                <th className="table-header-cell">Change in OI</th>
                <th className="table-header-cell">
                  Percentage <br></br> Change in OI
                </th>
                <th className="table-header-cell">VWAP</th>
                <th className="table-header-cell">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {niftyFuturesFilterData && niftyFuturesFilterData?.map((item) => (
                <tr key={item?.id}>
                  <td className="table-cell">{item?.expiration}</td>
                  <td className="table-cell">{item?.open_interest}</td>
                  <td className="table-cell">{item?.change_in_open_interest}</td>
                  <td className="table-cell">{item?.percentage_change_in_open_interest}</td>
                  <td className="table-cell">{item?.vwap}</td>
                  <td className="table-cell">
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
