"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import { createContext, useMemo, useState, useEffect } from "react";

export const FutureContext = createContext({});

export const FutureProvider = ({ children }) => {
  // States
  const [data, setData] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [dateConfig, setDateConfig] = useState({
    firstTableDate: "",
    secondTableDate: "",
  });

  useEffect(() => {
    handleFatch();
  }, []);

  const handleFatch = async () => {
    try {
      const response = await axiosInstance.get(
        `http://192.168.0.179:8000/${API_ROUTER.LIST_MARKET_DATAL}`
        //project is temporary running on this IP
      );
      setData(response.data);
      const updatedData = Object.groupBy(response.data, ({ date }) => date);
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
        Object.keys(marketData).indexOf(dateConfig.firstTableDate) + 1
      );
    } else [];
  }, [FIRST_DATE_OPTIONS, dateConfig.firstTableDate, marketData]);

  const handleDateChange = (e, selectedDateKey) => {
    const selectedData = Object.keys(marketData);
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
    <FutureContext.Provider
      value={{
        handleDateChange,
        SECOND_DATE_OPTIONS,
        FIRST_DATE_OPTIONS,
        FIRST_TABLE_DATA,
        SECOND_TABLE_DATA,
        fetchFutureData: handleFatch,
        data,
        dateConfig,
        marketData,
      }}
    >
      {children}
    </FutureContext.Provider>
  );
};
