"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";

export default function Optionchainlist() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const handleFatch = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_ROUTER.LIST_OPTIONCHAIN_DATA}`
        );

        setData(response.data);
        console.log("response.data", response.data);
        // const updatedData = Object.groupBy(response.data, ({ date }) => date);
        // setMarketData(updatedData);

        // Set the default selected date to the first date in the data
        // if (Object.keys(updatedData).length > 0) {
        //   const defaultDate = Object.keys(updatedData)[0];
        //   //   setSelectedDate(defaultDate);
        //   setDateConfig((prev) => ({
        //     ...prev,
        //     firstTableDate: defaultDate,
        //     secondTableDate: Object.keys(updatedData)[1],
        //   }));
        //   //   setSelectedData(updatedData[defaultDate]);
        // }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    handleFatch();
  }, []);
  return (
    <>
      <div>
        <h1 style={{ textAlign: "center", marginTop: "20px", color: "green" }}>
          Option Chain Data
        </h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client Type</th>
              <th>Future Index Long</th>
              <th>Future Index Short</th>
              <th>Future Stock Long</th>
              <th>Future Stock Short</th>
              <th>Option Index Call Long</th>
              <th>Option Index Call Short</th>
              <th>Option Index Put Long</th>
              <th>Option Index Put Short</th>
              <th>Option Stock Call Long</th>
              <th>Option Stock Call Short</th>
              <th>Option Stock Put Long</th>
              <th>Option Stock Put Short</th>
              <th>Total Long Contracts</th>
              <th>Total Short Contracts</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.client_type}</td>
                <td>{item.future_index_long}</td>
                <td>{item.future_index_short}</td>
                <td>{item.future_stock_long}</td>
                <td>{item.future_stock_short}</td>

                <td>{item.option_index_call_long}</td>
                <td>{item.option_index_call_short}</td>
                <td>{item.option_index_put_long}</td>
                <td>{item.option_index_put_short}</td>
                <td>{item.option_stock_call_long}</td>
                <td>{item.option_stock_call_short}</td>
                <td>{item.option_stock_put_long}</td>
                <td>{item.option_stock_put_short}</td>

                <td>{item.total_long_contracts}</td>
                <td>{item.total_short_contracts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
