"use client";

import React from "react";
import { useEffect, useState } from "react";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";

export default function StockData() {
  const [data, setData] = useState([]);
  const [displayedDates, setDisplayedDates] = useState(new Set());

  useEffect(() => {
    const handleFatch = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_ROUTER.LIST_STOCK_DATA}`
        );

        setData(response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    handleFatch();
  }, []);

  const filteredData = data.filter((item) => {
    const date = item.latest_trading_day;
    if (!displayedDates.has(date)) {
      setDisplayedDates((prevDates) => new Set(prevDates.add(date)));
      return true;
    }
    return false;
  });
  return (
    <>
      <div>
        <h1 style={{ textAlign: "center", marginTop: "20px", color: "green" }}>
          Relince Stock Data
        </h1>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Latest Trading Day</th>
              <th>Open</th>
              <th>Hign</th>
              <th>Low</th>
              <th>Price</th>
              <th>Volume</th>
              <th>Previous Close</th>
              <th>Change</th>
              <th>Change Percent</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                {console.log("first", item)}
                <td>{item.symbol}</td>
                <td>{item.latest_trading_day}</td>
                <td>{item.open}</td>
                <td>{item.high}</td>
                <td>{item.low}</td>
                <td>{item.price}</td>
                <td>{item.volume}</td>
                <td>{item.previous_close}</td>
                <td>{item.change}</td>
                <td>{item.change_percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
