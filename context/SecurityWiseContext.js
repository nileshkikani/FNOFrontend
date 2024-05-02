"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, {
  createContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

export const SecurityWiseContext = createContext({});

const initialState = {
  data: [],
  uniqueDates: [],
  isLoading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_UNIQUE_DATES":
      return { ...state, uniqueDates: action.payload };
    default:
      return state;
  }
};

export const SecurityWiseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { uniqueDates, data } = state;

  // ----------------API CALL-----------------
  const getData = useCallback(async (selectedDate) => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      let apiUrl = `${API_ROUTER.LIST_SECWISE_DATE}`;
      if (selectedDate) {
        apiUrl += `?date=${selectedDate}`;
      }
      const token = Cookies.get("access");
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      selectedDate
        ? dispatch({ type: "SET_DATA", payload: response.data })
        : dispatch({
            type: "SET_UNIQUE_DATES",
            payload: response.data.unique_dates,
          });

      dispatch({ type: "SET_IS_LOADING", payload: false });
    } catch (err) {
      toast.error("Error getting data");
      console.log("Error is this::", err);
    }
  }, []);

  // ----------------SELECT DATE FROM DROPDOWN------------
  const setDropdownDate = (event) => {
    const d = event.target.value;
    getData(d);
  };


  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      getData,
      setDropdownDate,
      uniqueDates,
    }),
    [state, data, getData, setDropdownDate, uniqueDates]
  );

  return (
    <SecurityWiseContext.Provider value={contextValue}>
      {children}
    </SecurityWiseContext.Provider>
  );
};

export default SecurityWiseContext;
