"use client";
import { API_ROUTER } from "@/services/apiRouter";
// import axiosInstance from "@/utils/axios";
import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const NiftyFutureContext = createContext({});

export const NiftyFutureProvider = ({ children }) => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [uniqueDatesArray, setUniqueDatesArray] = useState([]);

  const expiry = apiData.slice(0, 3);

  const filterByCreatedDate = apiData.filter((item) => {
    return (
      item.expiration === selectedOption &&
      (selectedDate
        ? new Date(item.created_at).toLocaleDateString() === selectedDate
        : true)
    );
  });

  const reversedFilteredData = filterByCreatedDate.reverse().slice(0, 20);

  const getData = async () => {
    setIsLoading(true);
    await axios
      .get(`${API_ROUTER.NIFTY_FUTURE_DATA}`)
      .then((response) => {
        setApiData(response.data);
        setIsLoading(false);
        setSelectedOption(response.data[0]?.expiration);
        const uniqueDatesSet = new Set();
        response.data.forEach((item) => {
          const date = new Date(item?.created_at).toLocaleDateString();
          uniqueDatesSet.add(date);
        });
        setUniqueDatesArray(Array.from(uniqueDatesSet));
      })
      .catch((err) => {
        toast.error("error getting data");
        console.log("error is this:", err);
      });
  };

  const handleDateChange = (event) => {
    const myDate = event.target.value;
    setSelectedDate(myDate);
  };

  const handleExpiryChange = (event) => {
    const myExpiry = event.target.value;
    setSelectedOption(myExpiry);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <NiftyFutureContext.Provider
      value={{
        apiData,
        expiry,
        isLoading,
        selectedOption,
        filterByCreatedDate,
        selectedDate,
        uniqueDatesArray,
        reversedFilteredData,
        handleDateChange,
        handleExpiryChange,
      }}
    >
      {children}
    </NiftyFutureContext.Provider>
  );
};
