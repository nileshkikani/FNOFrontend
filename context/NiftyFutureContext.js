"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, { createContext, useEffect, useReducer, useMemo } from "react";
import { toast } from "react-hot-toast";
// import axios from "axios";
import Cookies from 'js-cookie';
// import useAuth from "@/hooks/useAuth";

export const NiftyFutureContext = createContext({});

const initialState = {
  apiData: [],
  isLoading: true,
  selectedOption: null,
  selectedDate: "",
  uniqueExpiryDatesArray: [],
  uniqueCreatedDatesArray: [],
  checkMonth: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
        uniqueCreatedDatesArray: action.payload.uniqueCreatedDatesArray,
        isLoading: false,
      };
    case "SET_SELECTED_DATE":
      return {
        ...state,
        selectedDate: action.payload.selectedDate,
        checkMonth: action.payload.selectedMonth,
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
  // const { isLoggedIn } = useAuth();

  const {
    apiData,
    isLoading,
    selectedOption,
    selectedDate,
    uniqueExpiryDatesArray,
    checkMonth,
    uniqueCreatedDatesArray,
  } = state;

  // ----------API CALL FUNCTION------------

  const getData = async () => {
    dispatch({ type: "SET_DATA", payload: { isLoading: true } });
    try {
      const token = Cookies.get("access");
      // console.log("NIFTY FUTURE CALL:::::,",token);

      const response = await axiosInstance.get(API_ROUTER.NIFTY_FUTURE_DATA,
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      // ---------UNIQUE DATE n EXPIRY SELECTION----------
      const uniqueDatesSet = new Set();
      const uniqueCreatedDateSet = new Set();

      response.data.forEach((item) => {
        uniqueDatesSet.add(item?.expiration);
        const formattedDate = new Date(item?.created_at).toLocaleDateString();
        uniqueCreatedDateSet.add(formattedDate);
      });
      if(response.status===200){
      dispatch({
        type: "SET_DATA",
        payload: {
          apiData: response.data,
          selectedOption: response.data[0]?.expiration,
          uniqueExpiryDatesArray: Array.from(uniqueDatesSet).reverse(),
          uniqueCreatedDatesArray: Array.from(uniqueCreatedDateSet).reverse(),
        },
      });
      // const currentPath = window.location.pathname;
      // localStorage.setItem('lastPath', currentPath);
    }
    } catch (error) {
      toast.error("Error getting data");
      console.error("Error:", error);
    }
  };

  // ----------------------DATE FILTER----------------------------
  const filterByCreatedDate = useMemo(
    () =>
      apiData.filter(
        (item) =>
          item.expiration === selectedOption &&
          (!selectedDate ||
            new Date(item.created_at).toLocaleDateString() === selectedDate)
      ),
    [apiData, selectedOption, selectedDate]
  );

  // -------CREATED DATE----------
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    // console.log("from fate change function", selectedDate);
    const [day, month, year] = selectedDate.split("/");
    const formattedDate = `${year}-${month}-${day}`;
    const dateObject = new Date(formattedDate);
    const selectedMonth = dateObject.getMonth();

    dispatch({
      type: "SET_SELECTED_DATE",
      payload: { selectedMonth: selectedMonth + 1, selectedDate: selectedDate },
    });
  };


  //----------EXPIRY DROPDOWN HANDLE-----------
  const handleExpiryChange = (event) => {
    if (checkMonth >= 4) {
      const newArr = uniqueExpiryDatesArray;
      dispatch({
        type: "SET_DATA",
        payload: { uniqueCreatedDatesArray: newArr },
      });
    }
    dispatch({ type: "SET_SELECTED_OPTION", payload: event.target.value });
  };


  return (
    <NiftyFutureContext.Provider
      value={{
        apiData,
        getData,
        isLoading,
        selectedOption,
        filterByCreatedDate,
        selectedDate,
        uniqueExpiryDatesArray,
        uniqueCreatedDatesArray,
        // reversedFilteredData,
        handleDateChange,
        handleExpiryChange,
      }}
    >
      {children}
    </NiftyFutureContext.Provider>
  );
};
