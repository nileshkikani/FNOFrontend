"use client";
import React, { useMemo } from "react";
import axiosInstance from "@/utils/axios";
import { API_ROUTER } from "@/services/apiRouter";
import { useEffect, useState } from "react";
// import axios from "axios";

function TotalData() {
  const [data, setData] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [dateConfig, setDateConfig] = useState({
    firstTableDate: "",
    secondTableDate: "",
  });
  const [uniqueDate, setUniqueDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const handleFatch = async () => {
      try {
        const response = await axiosInstance
          .get(`${API_ROUTER.LIST_MARKET_DATAL}`)
          .then((response) => {
            setData(response.data);
            const uniqueDatesSet = new Set();
      data.forEach((item) => {
        const date = new Date(item?.date).toLocaleDateString();
        uniqueDatesSet.add(date);
      });
          })
          .catch((err) => console.log("error while fetching data", err));

        const updatedData = Object.groupBy(data, ({ date }) => date);
        setMarketData(updatedData);

        // Set the default selected date to the first date in the data
        if (Object.keys(updatedData).length > 0) {
          const defaultDate = Object.keys(updatedData)[0];
          //   setSelectedDate(defaultDate);
          setDateConfig((prev) => ({
            ...prev,
            firstTableDate: defaultDate,
            secondTableDate: Object.keys(updatedData)[1],
          }));
          //   setSelectedData(updatedData[defaultDate]);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    handleFatch();
  }, []);

  const filteredData = useMemo(() => {
    //---------------------
    return data.filter((item) => item.date === selectedDate);
  }, [data, selectedDate]);

  const FIRST_TABLE_DATA = useMemo(() => {
    if (marketData) {
      return marketData[dateConfig.firstTableDate];
    }
    return [];
  }, [marketData, dateConfig]);

  const SECOND_TABLE_DATA = useMemo(() => {
    if (marketData) {
      return marketData[dateConfig.secondTableDate];
    }
    return [];
  }, [marketData, dateConfig]);

  const FIRST_DATE_OPTIONS = useMemo(() => {
    if (marketData) {
      return Object.keys(marketData);
    } else [];
  }, [marketData]);

  const SECOND_DATE_OPTIONS = useMemo(() => {
    if (FIRST_DATE_OPTIONS && FIRST_DATE_OPTIONS.length > 0) {
      return Object.keys(marketData).slice(
        Object.keys(marketData).indexOf(dateConfig.firstTableDate)
      );
    } else [];
  }, [FIRST_DATE_OPTIONS, dateConfig]);

  const handleDateChange = (e, selectedDateKey) => {
    const selectedData = Object.keys(marketData);
    console.log("selectedData", selectedData);
    setSelectedDate(e.target.value); //-----------------------------------------
    setDateConfig((prev) => ({
      ...prev,
      [selectedDateKey]: e.target.value,
      ...(selectedDateKey === "firstTableDate"
        ? {
            secondTableDate:
              selectedData.findIndex((item) => item === e.target.value) <
              selectedData.length - 1
                ? selectedData[
                    selectedData.findIndex((item) => item === e.target.value) +
                      1
                  ]
                : "",
          }
        : {}),
      ...(selectedDateKey === "secondTableDate"
        ? {
            firstTableDate:
              selectedData[
                selectedData.findIndex((item) => item === e.target.value) - 1
              ],
          }
        : {}),
    }));
  };

  return (
    <>
      <div>
        <h1 style={{ textAlign: "center", marginTop: "20px", color: "green" }}>
          Total Data
        </h1>
        <label>
          Date:
          <select>
            {uniqueDate.map((date) => (
              <option key={date} value={date} onChange={handleDateChange}>
                {date}
              </option>
            ))}
          </select>
        </label>
        <table style={{ align: "center" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client Type</th>
              <th>Total Long Contracts</th>
              <th>Total Short Contracts</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.client_type}</td>
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

export default TotalData;
