"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
// import axios from "axios"
import React, { createContext, useEffect, useReducer, useMemo } from "react";
import { toast } from "react-hot-toast";

export const NiftyFutureContext = createContext({});

const initialState = {
  apiData: [],
  isLoading: true,
  selectedOption: null,
  selectedDate: "",
  uniqueDatesArray: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        apiData: action.payload.apiData,
        isLoading: false,
        selectedOption: action.payload.selectedOption,
        uniqueDatesArray: action.payload.uniqueDatesArray,
      };
    case "SET_SELECTED_DATE":
      return {
        ...state,
        selectedDate: action.payload,
      };
    case "SET_SELECTED_OPTION":
      return {
        ...state,
        selectedOption: action.payload,
      };
    default:
      return state;
  }
};

export const NiftyFutureProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { apiData, isLoading, selectedOption, selectedDate, uniqueDatesArray } =
    state;

  const expiry = useMemo(() => apiData?.slice(0, 3) || [], [apiData]);

  const filterByCreatedDate = useMemo(
    () =>
      apiData?.filter((item) => {
        return (
          item.expiration === selectedOption &&
          (selectedDate
            ? new Date(item.created_at).toLocaleDateString() === selectedDate
            : true)
        );
      }) || [],
    [apiData, selectedOption, selectedDate]
  );

  const reversedFilteredData = useMemo(
    () => filterByCreatedDate?.reverse().slice(0, 20) || [],
    [filterByCreatedDate]
  );

  const getData = async () => {
    dispatch({ type: "SET_DATA", payload: { isLoading: true } });

    // ------API CALL------------
    try {
      const response = await axiosInstance.get(`${API_ROUTER.NIFTY_FUTURE_DATA}`);
      const uniqueDatesSet = new Set();
      response.data.forEach((item) => {
        const date = new Date(item?.created_at).toLocaleDateString();
        uniqueDatesSet.add(date);
      });
      dispatch({
        type: "SET_DATA",
        payload: {
          apiData: response.data,
          selectedOption: response.data[0]?.expiration,
          uniqueDatesArray: Array.from(uniqueDatesSet),
        },
      });
    } catch (err) {
      toast.error("error getting data");
      console.log("error is this:", err);
    }
  };

  //---------DATE CHANGE DROPDOWN-----------

  const handleDateChange = (event) => {
    const myDate = event.target.value;
    dispatch({ type: "SET_SELECTED_DATE", payload: myDate });
  };

  //---------EXPIRY DATE DROPDOWN-----------
  const handleExpiryChange = (event) => {
    const myExpiry = event.target.value;
    dispatch({ type: "SET_SELECTED_OPTION", payload: myExpiry });
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
