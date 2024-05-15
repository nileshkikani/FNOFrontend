'use client';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';
import axiosInstance from '@/utils/axios';
import { useRouter } from 'next/navigation';
// import axios from "axios";
import React, { createContext, useReducer, useState } from 'react';
import { toast } from 'react-hot-toast';

export const CashflowContext = createContext({});

const initialState = {
  data: [],
  // isLoading: true,
  uniqueSymbolData: [],
  selectedStock: [],
  dateDropdown: [],
  copiedDateArray: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
        // isLoading: action.payload
      };
    case 'SET_UNIQUE_SYMBOL_DATA':
      return {
        ...state,
        uniqueSymbolData: action.payload
      };
    case 'SET_SELECTED_STOCK':
      return {
        ...state,
        selectedStock: action.payload
      };
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        dateDropdown: action.payload
      };
    case 'CURRENT_SELECTED_DATE':
      return {
        ...state,
        currentSelectedDate: action.payload
      };

    default:
      return state;
  }
};

export const CashflowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [alldate, setAllDate] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const [initialLoadForStock, setInitialLoadForStock] = useState(false);
  const [isLoading,setIsloading] = useState(true);
  const [currentSelectedDate,setCurrentSelectedDate] = useState('')

  const router = useRouter();
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

  const { data, uniqueSymbolData, selectedStock } = state;

  // --------------------API CALL------------------
  const getData = async (dateFromDropdown) => {
    if (!authState && checkUserIsLoggedIn) {
      return router.push('/login');
    }
    try {
      setIsloading(true);
      setCurrentSelectedDate(dateFromDropdown)
      let apiUrl = `${API_ROUTER.CASH_FLOW_TOP_TEN}`;
      if (dateFromDropdown) {
        apiUrl += `?date=${dateFromDropdown}`;
      }
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      const responseData = response.data;
      // -----------GETTING UNIQUE DATES----------
      if (response.status === 200) {
        if (responseData?.dates) {
          setAllDate(responseData?.dates);
          setInitialLoad(true);
        }
        dispatch({ type: 'SET_SELECTED_DATE', payload: responseData?.dates });
        const uniqueDatesSet = new Set();
        response.data.forEach((item) => {
          const date = new Date(item?.created_at);
          const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
          const formattedDate = date.toLocaleDateString('en-US', options);
          uniqueDatesSet.add(formattedDate);
        });
        dispatch({ type: 'SET_SELECTED_STOCK', payload: responseData });
        setInitialLoadForStock(true);

        //-------STOCK LIST------
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
        dispatch({ type: 'SET_UNIQUE_SYMBOL_DATA', payload: uniqueSymbolData });
        dispatch({ type: 'SET_DATA', payload: responseData });
        setIsloading(false)
      } else {
        router.push('/login');
      }
    } catch (err) {
      toast.error('error getting cashflow data');
      console.log('error is this:', err);
    }
  };

  return (
    <CashflowContext.Provider
      value={{
        isLoading,
        getData,
        data,
        alldate,
        uniqueSymbolData,
        selectedStock,
        currentSelectedDate,
        dispatch,
        setInitialLoad,
        initialLoad,
        setInitialLoadForStock,
        initialLoadForStock
      }}
    >
      {children}
    </CashflowContext.Provider>
  );
};
