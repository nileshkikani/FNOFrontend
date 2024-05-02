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
// import axios from "axios";
import Cookies from "js-cookie";

export const MultiStrikeContext = createContext({});

const initialState = {
  data: [],
  isLoading: true,
  strikes: [],
  selectedStrikes:[]
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_STRIKES":
      return { ...state, strikes: action.payload };
    // case "SET_SELECTED_STRIKES":
    //   return { ...state, selectedStrikes: action.payload };
    default:
      return state;
  }
};

export const MultiStrikeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { strikes,selectedStrikes,data } = state;

  // ----------------API CALL-----------------
  const multiStrikeAPiCall = async (selectedStrike) => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      let apiUrl = `${API_ROUTER.MULTI_STRIKE}`;
      if (selectedStrike && selectedStrike.length > 0) {
        const strikesString = selectedStrike.join(',');
        apiUrl += `?strikes=${strikesString}`;
      }
      const token = Cookies.get("access");
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("full URL is now:",apiUrl);
      selectedStrike
        ? dispatch({ type: "SET_DATA", payload: response.data })
        : dispatch({
            type: "SET_STRIKES",
            payload: response.data.strike_prices,
          });

      dispatch({ type: "SET_IS_LOADING", payload: false });
    } catch (err) {
      toast.error("Error getting multistrike api");
      console.log("Error getting multistrike api, check::", err);
    }
  };

//   console.log("full dataaaaaa isssss:::::",data);

  // ----------------SELECT STRIKE CHECKBOX------------
  const setStrikeDate = (event) => {
    const d = event.target.value;
    if(selectedStrikes.includes(d)){
        const arrIndex = selectedStrikes.indexOf(d);
        selectedStrikes.splice(arrIndex,1)
    }else{
        selectedStrikes.push(d);
    }
    multiStrikeAPiCall(selectedStrikes);
  };



  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      strikes,
      multiStrikeAPiCall,
      setStrikeDate,
    }),
    [state, strikes, multiStrikeAPiCall, setStrikeDate,data]
  );

  return (
    <MultiStrikeContext.Provider value={contextValue}>
      {children}
    </MultiStrikeContext.Provider>
  );
};

export default MultiStrikeContext;
