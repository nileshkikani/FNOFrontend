'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useCallback, useMemo, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';
// import Cookie from "cookie-js"

export const SecurityWiseContext = createContext({});

const initialState = {
  data: [],
  uniqueDates: [],
  isLoading: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_UNIQUE_DATES':
      return { ...state, uniqueDates: action.payload };
    default:
      return state;
  }
};

export const SecurityWiseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentSelectedDate, setCurrentSelectedDate] = useState('');
  const router = useRouter();
  const { handleResponceError } = useAuth();
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);
  const { uniqueDates, data, isLoading } = state;
  const [hasMore, setHasMore] = useState(true); // Whether there are more pages to load
  const [page, setPage] = useState(1);

  // -------------------------API CALL------------------------

  const getData = useCallback(
    async (selectedDate, page) => {
      dispatch({ type: 'SET_IS_LOADING', payload: true });
      if (!authState && checkUserIsLoggedIn) {
        return router.push('/login');
      }
      try {
        let apiUrl = `${API_ROUTER.LIST_SECWISE_DATE}`;
        if (selectedDate) {
          apiUrl += `?page=${page}&date=${selectedDate}`;
        }
        const response = await axiosInstance.get(apiUrl, {
          headers: { Authorization: `Bearer ${authState.access}` }
        });
        if (response.status === 200) {
          console.log('response.data', response);
          const customDateComparator = (dateStr1, dateStr2) => {
            const date1 = new Date(dateStr1);
            const date2 = new Date(dateStr2);
            return date1 - date2;
          };

          if (selectedDate) {
            if (page === 1) {
              dispatch({ type: 'SET_DATA', payload: response.data });
            } else {
              dispatch({ type: 'SET_DATA', payload: [...state.data, ...response.data] });
            }
            setPage(page + 1);
          } else {
            dispatch({
              type: 'SET_UNIQUE_DATES',
              payload: response.data.dates.sort(customDateComparator).reverse()
            });
          }
          setHasMore(response.data.length > 0);
          dispatch({ type: 'SET_IS_LOADING', payload: false });
          // const currentPath = window.location.pathname;
          // localStorage.setItem('lastPath', currentPath);
        } else {
          setHasMore(false);
          router.push('/login');
        }
      } catch (err) {
        setHasMore(false);
        handleResponceError();
      }
    },
    [authState]
  );

  // ----------------SELECT DATE FROM DROPDOWN------------
  const setDropdownDate = (event) => {
    const d = event.target.value;
    setCurrentSelectedDate(d);
    setPage(1);
    getData(d, 1);
  };

  useEffect(() => {
    if (initialLoad && uniqueDates.length > 0) {
      setCurrentSelectedDate(uniqueDates[0]);
      getData(uniqueDates[0], page);
      setInitialLoad(false);
    }
  }, [getData, initialLoad, uniqueDates]);

  useEffect(() => {
    console.log('page', page);
    getData(currentSelectedDate, page);
  }, [page]);

  const NIFTY_STOCKS = [
    'HINDUNILVR',
    'HDFCBANK',
    'BAJAJFINSV',
    'HEROMOTOCO',
    'SHREECEM',
    'BPCL',
    'INDUSINDBK',
    'BHARTIARTL',
    'AXISBANK',
    'KOTAKBANK',
    'ICICIBANK',
    'UPL',
    'COALINDIA',
    'CIPLA',
    'GRASIM',
    'WIPRO',
    'BAJAJ-AUTO',
    'EICHERMOT',
    'NTPC',
    'SBIN',
    'HINDALCO',
    'DIVISLAB',
    'HDFCLIFE',
    'ULTRACEMCO',
    'TATACONSUM',
    'POWERGRID',
    'JSWSTEEL',
    'ADANIPORTS',
    'HCLTECH',
    'BAJFINANCE',
    'APOLLOHOSP',
    'DRREDDY',
    'TATAMOTORS',
    'BRITANNIA',
    'LT',
    'ONGC',
    'ASIANPAINT',
    'TCS',
    'SUNPHARMA',
    'MARUTI',
    'TECHM',
    'TATASTEEL',
    'ITC',
    'SBILIFE',
    'RELIANCE',
    'TITAN',
    'INFY',
    'M&M',
    'NESTLEIND',
    'HDFCBANK'
  ];

  // --------------------HANDLE NIFTY-STOCKS CHECKBOX---------------
  const showNiftyStocksOnly = (isChecked) => {
    if (isChecked) {
      const niftyStocksOnly = data.filter((item) => NIFTY_STOCKS.includes(item.symbol));
      dispatch({ type: 'SET_DATA', payload: niftyStocksOnly });
    } else {
      getData(currentSelectedDate);
    }
  };

  // -------------------EACH STOCK GRAPH--------------
  // const stockGraph = (params) => {
  //   console.log(params);
  // };

  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      getData,
      setDropdownDate,
      uniqueDates,
      showNiftyStocksOnly,
      // stockGraph,
      isLoading,
      currentSelectedDate
    }),
    [
      state,
      data,
      getData,
      setDropdownDate,
      uniqueDates,
      showNiftyStocksOnly,
      // stockGraph,
      isLoading,
      currentSelectedDate,
      hasMore
    ]
  );

  return <SecurityWiseContext.Provider value={contextValue}>{children}</SecurityWiseContext.Provider>;
};

export default SecurityWiseContext;
