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
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";

export const MultiStrikeContext = createContext({});

const initialState = {
  data: [],
  isLoading: true,
  strikes: [],
  selectedStrikes: [],
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
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth.authState);

  const { strikes, selectedStrikes, data } = state;

  // ----------------API CALL-----------------
  const multiStrikeAPiCall = async (selectedStrike) => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    if(!authState){
      return
    }
    try {
      let apiUrl = `http://192.168.0.179:8000/multy/`;
      if (selectedStrike && selectedStrike.length > 0) {
        const strikesString = selectedStrike.join(",");
        apiUrl += `?strikes=${strikesString}`;
      }
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` },
      });

      if (response.status === 200) {
        selectedStrike
          ? dispatch({ type: "SET_DATA", payload: response.data })
          : dispatch({
              type: "SET_STRIKES",
              payload: response.data.strike_prices,
            });
        console.log("from context:::,", response.data);
        // console.log("hhhhhhhhhh,",typeof response.data)
        dispatch({ type: "SET_IS_LOADING", payload: false });
        // const currentPath = window.location.pathname;
        // localStorage.setItem('lastPath', currentPath);
      } else {
        router.push("/login");
      }
    } catch (err) {
      toast.error("Error getting multistrike api");
      console.log("Error getting multistrike api, check::", err);
    }
  };

  // ----------------SELECT STRIKE CHECKBOX------------
  const setStrikeDate = (event) => {
    const d = event.target.value;
    if (selectedStrikes.includes(d)) {
      const arrIndex = selectedStrikes.indexOf(d);
      selectedStrikes.splice(arrIndex, 1);
    } else {
      selectedStrikes.push(d);
    }
    // console.log(d, "tttttttttttttttttttt");
    multiStrikeAPiCall(selectedStrikes);
  };

  // console.log("selected pricve", selectedStrikes);

  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      strikes,
      multiStrikeAPiCall,
      setStrikeDate,
      selectedStrikes,
    }),
    [state, strikes, multiStrikeAPiCall, setStrikeDate, data, selectedStrikes]
  );

  return (
    <MultiStrikeContext.Provider value={contextValue}>
      {children}
    </MultiStrikeContext.Provider>
  );
};

export default MultiStrikeContext;
