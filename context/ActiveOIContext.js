'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useCallback, useMemo } from 'react';
import Cookie from 'js-cookie';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { setRememberMe, setUserStatus, setUserStatusInitially } from '@/store/authSlice';
import useAuth from '@/hooks/useAuth';

export const ActiveOiContext = createContext({});

const initialState = {
  data: [],
  uniqueDates: [],
  filteredByDate: [],
  filteredByDateForRange: [],
  selectedDate: '',
  isLoading: true,
  checkFive: true
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_UNIQUE_DATES':
      return { ...state, uniqueDates: action.payload };
    case 'FILTERED_BY_DATE':
      return { ...state, filteredByDate: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CHECK_FIVE':
      return { ...state, checkFive: action.payload };
    case 'FILTERED_BY_DATE_FOR_RANGE':
      return { ...state, filteredByDateForRange: action.payload };
    default:
      return state;
  }
};

export const ActiveOiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { handleResponceError } = useAuth();

  const router = useRouter();
  const storeDispatch = useDispatch();

  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

  // -----------API CALL---------------------------
  const getData = useCallback(async () => {
    if (!authState && !checkUserIsLoggedIn) {
      return;
    }
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    try {
      const response = await axiosInstance.get(API_ROUTER.ACTIVE_OI, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      if (response.status === 200) {
        const uDate = Array.from(new Set(response.data.map((item) => item.created_at.split('T')[0])));
        dispatch({ type: 'SET_DATA', payload: response.data });
        dispatch({ type: 'SET_UNIQUE_DATES', payload: uDate });
        const initiald = uDate[0];
        const initialData = response.data.filter((item) => item.created_at.split('T')[0] === initiald);
        dispatch({ type: 'FILTERED_BY_DATE', payload: initialData });

        //-------DEEP CLONING AND REVERSING FOR CHARTS ONLY------------
        const clonedFilteredByDate = JSON.parse(JSON.stringify(initialData));
        const reversedFilteredByDate = clonedFilteredByDate.reverse();
        dispatch({
          type: 'FILTERED_BY_DATE_FOR_RANGE',
          payload: reversedFilteredByDate
        });
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      } else {
        console.log('inside AOI');
        router.push('/login');
      }
    } catch (err) {
      handleResponceError();
    }
  }, [authState]);

  // --------DATE DROPDOWN---------
  const dateDropDownChange = useCallback(
    async (event) => {
      const selectedDate = event.target.value;
      const filteredByDate = state.data.filter((item) => item.created_at.split('T')[0] === selectedDate);

      //-------DEEP CLONING AND REVERSING FOR CHARTS ONLY------------
      const clonedFilteredByDate = JSON.parse(JSON.stringify(filteredByDate));
      const reversedFilteredByDate = clonedFilteredByDate.reverse();
      dispatch({
        type: 'FILTERED_BY_DATE_FOR_RANGE',
        payload: reversedFilteredByDate
      });
      dispatch({ type: 'FILTERED_BY_DATE', payload: filteredByDate });
    },
    [state.data]
  );

  // -----------CHECK 5 or 15-----------
  const dropDownChange = useCallback((event) => {
    const selectedValue = event.target.value;
    dispatch({ type: 'CHECK_FIVE', payload: selectedValue === '15' });
  }, []);

  // ---------NIFTY RANGE CALCULATE-----------
  const maxLiveNifty = Math.max(...state.filteredByDate.map((item) => item?.live_nifty));
  const minLiveNifty = Math.min(...state.filteredByDate.map((item) => item?.live_nifty));
  const range = 10;
  const adjustedNiftyStart = minLiveNifty - range;
  const adjustedNiftyEnd = maxLiveNifty + range;

  const contextValue = useMemo(
    () => ({
      ...state,
      getData,
      dateDropDownChange,
      dropDownChange,
      adjustedNiftyStart,
      adjustedNiftyEnd
    }),
    [state, getData, dateDropDownChange, dropDownChange, adjustedNiftyStart, adjustedNiftyEnd]
  );

  return <ActiveOiContext.Provider value={contextValue}>{children}</ActiveOiContext.Provider>;
};
