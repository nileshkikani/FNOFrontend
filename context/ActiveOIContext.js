"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, { createContext, useState, useMemo } from "react";
import { toast } from "react-hot-toast";

export const ActiveOiContext = createContext({});

export const ActiveOiProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (page) => {
    setIsLoading(true);
    await axiosInstance
      .get(`${API_ROUTER.ACTIVE_OI}?page=${page}`)
      .then((response) => {
        setData(response.data.results);
        setRecordCount(response.data.count);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("error getting data");
        console.log("error is this:", err);
      });
  };

  const fetchActiveOIData = async (page) => {
    await getData(page);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // const memoizedValues = useMemo(
  //   () => ({
  //     data,
  //     fetchActiveOIData,
  //     handlePrevious,
  //     handleNext,
  //     isLoading,
  //     currentPage,
  //     recordCount,
  //   }),
  //   [data, fetchActiveOIData, handlePrevious, handleNext, isLoading, currentPage, recordCount]
  // );

  return (
    <ActiveOiContext.Provider
      value={{
        data,
        fetchActiveOIData,
        handlePrevious,
        handleNext,
        isLoading,
        currentPage,
        recordCount,
      }}
    >
      {children}
    </ActiveOiContext.Provider>
  );
};
