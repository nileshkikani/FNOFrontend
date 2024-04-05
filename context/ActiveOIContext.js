"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, { createContext, useReducer, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";

export const ActiveOiContext = createContext({});


// -------INITIAL STATES--------

const initialState = {
  data: [],
  currentPage: 1,
  recordCount: 0,
  isLoading: true,
  checkFive: true,
};

// ----------REDUCERS-----------
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_RECORD_COUNT":
      return { ...state, recordCount: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "CHECK_FIVE":
      return { ...state, checkFive: action.payload };
    default:
      return state;
  }
};

export const ActiveOiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // -------API CALL----------
  const getData = useCallback(async (page) => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      const response = await axiosInstance.get(
        `${API_ROUTER.ACTIVE_OI}?page=${page}`
      );
      dispatch({ type: "SET_DATA", payload: response.data.results });
      dispatch({ type: "SET_RECORD_COUNT", payload: response.data.count });
      dispatch({ type: "SET_IS_LOADING", payload: false });
    } catch (err) {
      toast.error("error getting data");
      console.log("error is this:", err);
    }
  }, []);

  const fetchActiveOIData = useCallback(
    async (page) => {
      dispatch({ type: "SET_CURRENT_PAGE", payload: page });
      await getData(page);
    },
    [getData]
  );

  // --------PREVIOUS BUTTON-------------
  const handlePrevious = useCallback(() => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: state.currentPage - 1 });
  }, [state.currentPage]);

  // --------------NEXT BUTTON--------
  const handleNext = useCallback(() => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: state.currentPage + 1 });
  }, [state.currentPage]);

  const contextValue = useMemo(
    () => ({
      ...state,
      fetchActiveOIData,
      handlePrevious,
      handleNext,
    }),
    [state, fetchActiveOIData, handlePrevious, handleNext]
  );

  return (
    <ActiveOiContext.Provider value={contextValue}>
      {children}
    </ActiveOiContext.Provider>
  );
};
