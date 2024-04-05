"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import { createContext, useMemo, useState } from "react";
import { useEffect } from "react";
// import axios from "axios";

export const OptionsContext = createContext({});

export const OptionsProvider = ({ children }) => {
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
        `${API_ROUTER.LIST_MARKET_DATAL}`
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
        Object.keys(marketData).indexOf(dateConfig.firstTableDate)
      );
    } else [];
  }, [FIRST_DATE_OPTIONS, dateConfig]);

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
    <OptionsContext.Provider
      value={{
        handleDateChange,
        SECOND_DATE_OPTIONS,
        FIRST_DATE_OPTIONS,
        FIRST_TABLE_DATA,
        SECOND_TABLE_DATA,
        fetchOptionsData: handleFatch,
        data,
        dateConfig,
        marketData,
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
};
