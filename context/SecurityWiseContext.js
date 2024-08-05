'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useCallback, useMemo, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';

// import Cookie from "cookie-js"

export const SecurityWiseContext = createContext({});

const initialState = {
  data: [],
  uniqueDates: [],
  isLoading: true,
  page: 1
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PAGE':
      // console.log('action.payload', action.payload);
      return { ...state, page: action.payload };

    case 'SET_DATA':
      // console.log('state.page', state.page);
      return {
        ...state,
        data: state.page === 1 ? action.payload : [...state.data, ...action.payload]
      };
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
  const [isChangedDate, setIsChangedDate] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [securityData, setSecurityData] = useState([]);
  const route = useRouter();
  const pathname = usePathname();

  // -------------------------API CALL------------------------

  const getData = useCallback(
    async (selectedDate, page, isNifty) => {
      // console.log('page---', page, isNifty);
      dispatch({ type: 'SET_IS_LOADING', payload: page === 1 ? true : false });

      dispatch({ type: 'SET_PAGE', payload: page });

      if (!authState && checkUserIsLoggedIn) {
        return router.push('/login');
      }
      try {
        if (page > 2 && isNifty) {
          return; 
        }
        let apiUrl = `${API_ROUTER.LIST_SECWISE_DATE}`;
        if (selectedDate) {
          if (!isNifty) {
            apiUrl += `?page=${page}&date=${selectedDate}`;
          } else {
            apiUrl += `?date=${selectedDate}&is_nifty=${isNifty}&page=${page}`;
          }
        } else {
          // Handle the case where selectedDate is not provided if needed
          // Example: apiUrl += `?page=${page}`;
        }
      
        const response = await axiosInstance.get(apiUrl, {
          headers: { Authorization: `Bearer ${authState.access}` }
        });
      
        if (response.status === 200) {
          const customDateComparator = (dateStr1, dateStr2) => {
            const date1 = new Date(dateStr1);
            const date2 = new Date(dateStr2);
            return date1 - date2;
          };
      
          if (selectedDate) {
            if (page === 1) {
              dispatch({ type: 'SET_DATA', payload: response.data.results });
              dispatch({ type: 'SET_IS_LOADING', payload: false });
            } else {
              dispatch({ type: 'SET_DATA', payload: [...state.data, ...response.data.results] });
            }
            setHasMore(response.data.results.length > 0);
          } else {
            dispatch({
              type: 'SET_UNIQUE_DATES',
              payload: response.data.dates.sort(customDateComparator).reverse()
            });
          }
        } else {
          setHasMore(false);
          dispatch({ type: 'SET_IS_LOADING', payload: false });
          dispatch({ type: 'SET_DATA', payload: state.data });
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
    setIsChangedDate(true);
    // setPage(1);
    // dispatch({ type: 'SET_PAGE', payload: 1 });
    // dispatch({ type: 'SET_DATA', payload: [] });
    // dispatch({ type: 'SET_IS_LOADING', payload: true });

    // getData(d, 1, false);
  };
  const refreshData = () => {
    // setPage(1);
    dispatch({ type: 'SET_PAGE', payload: 1 });
    dispatch({ type: 'SET_DATA', payload: [] });
    dispatch({ type: 'SET_IS_LOADING', payload: false });

    // getData(d, 1, false);
  };

  // useEffect(() => {
  //   if (uniqueDates.length > 0) {
  //     // dispatch({ type: 'SET_PAGE', payload: 1 });

  //     setCurrentSelectedDate(uniqueDates[0]);
  //     // getData(uniqueDates[0], page);
  //     // setInitialLoad(false);
  //   }
  // }, [uniqueDates]);

  // useEffect(() => {
  //   console.log('page route.pathname', state.page, pathname);
  //   const routeName = pathname.match('securitywise');
  //   if (routeName) {
  //     // if (!isShowNifty) {
  //     if (isChangedDate) {
  //       // setPage(1);
  //       setIsChangedDate(false);
  //     }
  //     // setTimeout(() => {
  //     //   getData(currentSelectedDate, page, isShowNifty);
  //     // }, 500);
  //     // }
  //   } else {
  //     // setPage(1);
  //     dispatch({ type: 'SET_PAGE', payload: 1 });
  //     dispatch({ type: 'SET_DATA', payload: [] });
  //     dispatch({ type: 'SET_IS_LOADING', payload: false });
  //   }
  // }, [page, currentSelectedDate, isShowNifty]);

  // --------------------HANDLE NIFTY-STOCKS CHECKBOX---------------
  // const showNiftyStocksOnly = (isChecked) => {
  //   // setPage(1);
  //   dispatch({ type: 'SET_PAGE', payload: 1 });
  //   setTimeout(() => {
  //     if (isChecked) {
  //       setIsShowNifty(1);
  //       // getData(currentSelectedDate, 1, true);
  //       // const niftyStocksOnly = data.filter((item) => NIFTY_STOCKS.includes(item.symbol));
  //       // dispatch({ type: 'SET_DATA', payload: niftyStocksOnly });
  //     } else {
  //       setIsShowNifty(0);
  //       // getData(currentSelectedDate, 1, false);
  //     }
  //   }, 1000);
  // };

  // -------------------EACH STOCK GRAPH--------------
  // const stockGraph = (params) => {
  //   console.log(params);
  // };

  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      // page,
      getData,
      setDropdownDate,
      uniqueDates,
      // showNiftyStocksOnly,
      // stockGraph,
      setCurrentSelectedDate,
      isLoading,
      currentSelectedDate,
      hasMore,
      // isShowNifty,
      refreshData
    }),
    [
      state,
      data,
      // page,
      getData,
      setDropdownDate,
      uniqueDates,
      setCurrentSelectedDate,
      // showNiftyStocksOnly,
      // stockGraph,
      isLoading,
      currentSelectedDate,
      hasMore,
      // isShowNifty,
      refreshData
    ]
  );

  return <SecurityWiseContext.Provider value={contextValue}>{children}</SecurityWiseContext.Provider>;
};

export default SecurityWiseContext;
