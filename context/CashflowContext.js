'use client';
import React, { createContext, useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';
import axiosInstance from '@/utils/axios';

export const CashflowContext = createContext({});

const initialState = {
  data: [],
  uniqueSymbolData: [],
  selectedStock: [],
  dateDropdown: [],
  copiedDateArray: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_UNIQUE_SYMBOL_DATA':
      return { ...state, uniqueSymbolData: action.payload };
    case 'SET_SELECTED_STOCK':
      return { ...state, selectedStock: action.payload };
    case 'SET_SELECTED_DATE':
      return { ...state, dateDropdown: action.payload };
    case 'CURRENT_SELECTED_DATE':
      return { ...state, currentSelectedDate: action.payload };
    default:
      return state;
  }
};

export const CashflowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { handleResponceError } = useAuth();
  const [alldate, setAllDate] = useState([]);
  const [initialLoad, setInitialLoad] = useState(false);
  const [initialLoadForStock, setInitialLoadForStock] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  const [currentSelectedDate, setCurrentSelectedDate] = useState('');

  const router = useRouter();
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

  const { data, uniqueSymbolData, selectedStock } = state;

  const getData = async (dateFromDropdown) => {
    if (!authState && !checkUserIsLoggedIn) {
      return router.push('/login');
    }
    try {
      setIsloading(true);
      setCurrentSelectedDate(dateFromDropdown);
      let apiUrl = `${API_ROUTER.CASH_FLOW_TOP_TEN}`;
      if (dateFromDropdown) {
        apiUrl += `?date=${dateFromDropdown}`;
      }
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      const responseData = response.data;

      console.log("this is response:",response);
      dispatch({ type: 'SET_SELECTED_STOCK', payload: responseData });

      if (responseData?.dates) {
        setAllDate(responseData?.dates);
        setInitialLoad(true);
      }
      dispatch({ type: 'SET_SELECTED_DATE', payload: responseData?.dates });

      const symbolMap = new Map();
      response?.data?.forEach((item) => {
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
      setIsloading(false);
    } catch (err) {
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
