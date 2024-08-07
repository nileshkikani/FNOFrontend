'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useCallback, useMemo, useState, useEffect } from 'react';
// import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';


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
      return { ...state, page: action.payload };
    case 'SET_DATA':
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
  const [currentSelectedDate, setCurrentSelectedDate] = useState('');
  const router = useRouter();
  const { handleResponceError } = useAuth();
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);
  const { uniqueDates, data, isLoading } = state;
  const [hasMore, setHasMore] = useState(true);
  // -------------------------API CALL------------------------

  const getData = useCallback(
    async (selectedDate, page, isNifty) => {
      console.log('niftyIS', isNifty);
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
            apiUrl += `?date=${selectedDate}&page=${page}`;
          } else {
            apiUrl += `?date=${selectedDate}&page=${page}&is_nifty=${isNifty}`;
          }

        }

        // setTimeout(async() => {
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
        // }, 500);
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
  };
  const refreshData = () => {
    dispatch({ type: 'SET_PAGE', payload: 1 });
    dispatch({ type: 'SET_DATA', payload: [] });
    dispatch({ type: 'SET_IS_LOADING', payload: false });

  };


  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      getData,
      setDropdownDate,
      uniqueDates,
      setCurrentSelectedDate,
      isLoading,
      currentSelectedDate,
      hasMore,
      refreshData
    }),
    [
      state,
      data,
      getData,
      setDropdownDate,
      uniqueDates,
      setCurrentSelectedDate,
      isLoading,
      currentSelectedDate,
      hasMore,
      refreshData
    ]
  );

  return <SecurityWiseContext.Provider value={contextValue}>{children}</SecurityWiseContext.Provider>;
};

export default SecurityWiseContext;
