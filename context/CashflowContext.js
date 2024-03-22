"use client";
import { API_ROUTER } from "@/services/apiRouter";
// import axiosInstance from "@/utils/axios";
import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const CashflowContext = createContext({});

export const CashflowProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueSymbolData, setUniqueSymbolData] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");

  const handleDropdownChange = (event) => {
    setSelectedStock(event.target.value);
  };

  const selectedStockData = uniqueSymbolData.find(
    (stockData) => stockData[0]?.symbol === selectedStock
  );

  const getData = async () => {
    setIsLoading(true);
    await axios
      .get(`${API_ROUTER.CASH_FLOW_TOP_TEN}`)
      .then((response) => {
        const responseData = response.data;
        const symbolMap = new Map();
        responseData.forEach((item) => {
          const symbol = item.symbol;
          if (symbolMap.has(symbol)) {
            symbolMap.get(symbol).push(item);
          } else {
            symbolMap.set(symbol, [item]);
          }
        });
        const uniqueSymbolData = Array.from(symbolMap.values());
        setUniqueSymbolData(uniqueSymbolData);
        setData(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("error getting cashflow data");
        console.log("error is this:", err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <CashflowContext.Provider
      value={{
        isLoading,
        handleDropdownChange,
        uniqueSymbolData,
        selectedStock,
        selectedStockData,
      }}
    >
      {children}
    </CashflowContext.Provider>
  );
};
