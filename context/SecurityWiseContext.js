'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';
import toast from 'react-hot-toast';

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
        data: state.page === 1 ? action.payload :  action.payload
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
  const [searchTerm, setSearchTerm] = useState('');

  const getData = useCallback(
    async (selectedDate, page, isNifty, searchTerm) => {
      // console.log('niftyIS', isNifty);
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
  
        const queryParams = new URLSearchParams();
  
        if (selectedDate) queryParams.append('date', selectedDate);
        if (searchTerm) {
          queryParams.append('search', searchTerm);
          queryParams.delete('page');
        } else {
          if (page) queryParams.append('page', page); 
        }
        if (isNifty) queryParams.append('is_nifty', isNifty);
  
        if (queryParams.toString()) {
          apiUrl += `?${queryParams.toString()}`;
        }
  
        const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
  
        const response = await axiosInstance.get(apiUrl, {
          headers: { Authorization: `Bearer ${authState.access}` }
        });
  
        if (response.status === 200) {
          const customDateComparator = (dateStr1, dateStr2) => {
            const date1 = new Date(dateStr1);
            const date2 = new Date(dateStr2);
            return date1 - date2;
          };

          if(selectedDate && response?.data?.results?.length === 0){
            toast.error('no symbol found');
            return;
          }

          if (selectedDate) {
            if (page === 1) {
              dispatch({ type: 'SET_DATA', payload: response.data.results });
              dispatch({ type: 'SET_IS_LOADING', payload: false });
            } else if(searchTerm) {
              // console.log('gotSearch', response.data.results)
              dispatch({ type: 'SET_DATA', payload: response.data.results });
              dispatch({ type: 'SET_IS_LOADING', payload: false });
            }else {
              dispatch({ type: 'SET_DATA', payload: [...state.data, ...response.data.results] });
              dispatch({ type: 'SET_IS_LOADING', payload: false });
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
          dispatch({ type: 'SET_DATA', payload: state.data });
          dispatch({ type: 'SET_IS_LOADING', payload: false });
        }
      } catch (err) {
        setHasMore(false);
        // handleResponceError();
        console.log('caught');
      }
    },
    [authState, state.data, handleResponceError, checkUserIsLoggedIn, router]  
  );
  

  // console.log('fromContext', searchTerm);

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
      refreshData,
      setSearchTerm,
      searchTerm
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
      refreshData,
      setSearchTerm,
      searchTerm
    ]
  );

  return <SecurityWiseContext.Provider value={contextValue}>{children}</SecurityWiseContext.Provider>;
};

export default SecurityWiseContext;
