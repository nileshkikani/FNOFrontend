"use client";
import React from "react";
import useSecurityWiseData from "@/hooks/useSecurityWiseData";

export default function Page() {
  const { setDropdownDate, data, uniqueDates } = useSecurityWiseData();


  return (
    <>
      <label>
        Date
        <select onChange={setDropdownDate}>
          <option disabled selected value>
            select date
          </option>
          {uniqueDates
            .sort()
            .reverse()
            .map((itm,index) => (
              <option key={index} value={itm}>{itm}</option>
            ))}
        </select>
      </label>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            borderRadius: "8px",
            backgroundColor: "gray",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
          }}
        ></div>
      </div>
      <div className="scrolling-table">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Delivered Qty</th>
              <th>Avg Delivered Qty</th>
              <th>Traded Qty</th>
              <th>Avg Traded Qty</th>
              <th>Last Price</th>
              <th>% Dly Qt to Traded Qty</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>{item?.symbol}</td>
                <td>
                  {Number(item?.deliverable_qty).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                  <br />
                  <span className="green">{item?.times_delivery} x</span>
                </td>
                <td>
                  {Number(item?.average_delivery_quantity).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 0,
                    }
                  )}
                </td>
                <td>
                  {Number(item?.total_traded_quantity).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                  <br />
                  <span className="green">{item?.times_traded} x</span>
                </td>
                <td>
                  {Number(item?.average_traded_quantity).toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 0,
                    }
                  )}
                </td>
                <td>{item?.last_price}</td>
                <td>{item?.dly_qt_to_traded_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
