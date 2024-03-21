"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const NiftyFutureContext = createContext({});

export const NiftyFutureProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [uniqueDatesArray, setUniqueDatesArray] = useState([]);

  const filterByCreatedDate = data.filter((item) => {
    return (
      item.expiration === selectedOption &&
      (selectedDate
        ? new Date(item.created_at).toLocaleDateString() === selectedDate
        : true)
    );
  });

  const reversedFilteredData = filterByCreatedDate.reverse().slice(0, 20);;

  const getData = async () => {
    setIsLoading(true);
    await axiosInstance
      .get(`${API_ROUTER.NIFTY_FUTURE_DATA}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
        setSelectedOption(response.data[0]?.expiration);
        setUniqueDatesArray(filterByCreatedDate);

        //---set initial value of created at array here----
      })
      .catch((err) => {
        toast.error("error getting data");
        console.log("error is this:", err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <NiftyFutureContext.Provider
      value={{
        data,
        isLoading,
        setSelectedOption,
        selectedOption,
        selectedDate,
        setSelectedDate,
        setUniqueDatesArray,
        uniqueDatesArray,
        filterByCreatedDate,
        reversedFilteredData
      }}
    >
      {children}
    </NiftyFutureContext.Provider>
  );
};
