'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useCallback, useMemo, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';

export const MultiStrikeContext = createContext({});

const initialState = {
  data: [],
  isLoading: true,
  strikes: [],
  strikePrice1: [],
  strikePrice1IsChecked: false,
  strikePrice2: [],
  strikePrice2IsChecked: false,
  strikePrice3: [],
  strikePrice3IsChecked: false,
  strikePrice4: [],
  strikePrice4IsChecked: false,
  strikePrice4: [],
  strikePrice4IsChecked: false,
  strikePrice5: [],
  strikePrice5IsChecked: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_STRIKES':
      return { ...state, strikes: action.payload };
    case 'SET_STRIKE_1':
      return { ...state, strikePrice1: action.payload.strikePrice1, strikePrice1IsChecked: action.payload.status };
    case 'SET_STRIKE_2':
      return { ...state, strikePrice2: action.payload.strikePrice2, strikePrice2IsChecked: action.payload.status };
    case 'SET_STRIKE_3':
      return { ...state, strikePrice3: action.payload.strikePrice3, strikePrice3IsChecked: action.payload.status };
    case 'SET_STRIKE_4':
      return { ...state, strikePrice4: action.payload.strikePrice4, strikePrice4IsChecked: action.payload.status };
    case 'SET_STRIKE_5':
      return { ...state, strikePrice5: action.payload.strikePrice5, strikePrice5IsChecked: action.payload.status };
    default:
      return state;
  }
};

export const MultiStrikeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const router = useRouter();
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

  const {
    strikes,
    data,
    strikePrice1,
    strikePrice2,
    strikePrice3,
    strikePrice4,
    strikePrice5,
    strikePrice1IsChecked,
    strikePrice2IsChecked,
    strikePrice3IsChecked,
    strikePrice4IsChecked,
    strikePrice5IsChecked
  } = state;

  // ----------------API CALL-----------------
  const multiStrikeAPiCall = async () => {
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    if (!authState && checkUserIsLoggedIn) {
      return router.push('/login');
    }
    try {
      const apiUrl = API_ROUTER.MULTI_STRIKE;
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });

      if (response.status === 200) {
        dispatch({ type: 'SET_DATA', payload: response?.data });
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      } else {
        router.push('/login');
      }
    } catch (err) {
      toast.error('Error getting multistrike api');
      console.log('Error getting multistrike api, check::', err);
    }
  };



  useEffect(() => {
    const uniqueStrikePrices = [...new Set(data?.map((item) => item?.strike_price))];
    dispatch({ type: 'SET_STRIKES', payload: uniqueStrikePrices });
  }, [data]);

  // -------storing selected strike---------
  const checkSelectedStrike = (e, identifier) => {
    const filteredData = data?.filter((itm) => itm?.strike_price == `${e.target.value}`);


    switch (identifier) {
      case 1:
        // setStrikePrice1(filteredData);
        dispatch({ type: 'SET_STRIKE_1', payload: { strikePrice1: filteredData, status: !strikePrice1IsChecked } });
        break;
      case 2:
        dispatch({ type: 'SET_STRIKE_2', payload: { strikePrice2: filteredData, status: !strikePrice2IsChecked } });
        break;
      case 3:
        dispatch({ type: 'SET_STRIKE_3', payload: { strikePrice3: filteredData, status: !strikePrice3IsChecked } });
        break;
      case 4:
        dispatch({ type: 'SET_STRIKE_4', payload: { strikePrice4: filteredData, status: !strikePrice4IsChecked } });
        break;
      case 5:
        dispatch({ type: 'SET_STRIKE_5', payload: { strikePrice5: filteredData, status: !strikePrice5IsChecked } });
        break;
      default:
        break;
    }
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      strikes,
      multiStrikeAPiCall,
      checkSelectedStrike,
      strikePrice1,
      strikePrice2,
      strikePrice3,
      strikePrice4,
      strikePrice5,
      strikePrice1IsChecked,
      strikePrice2IsChecked,
      strikePrice3IsChecked,
      strikePrice4IsChecked,
      strikePrice5IsChecked
    }),
    [
      state,
      strikes,
      multiStrikeAPiCall,
      data,
      checkSelectedStrike,
      strikePrice1,
      strikePrice2,
      strikePrice3,
      strikePrice4,
      strikePrice5,
      strikePrice1IsChecked,
      strikePrice2IsChecked,
      strikePrice3IsChecked,
      strikePrice4IsChecked,
      strikePrice5IsChecked
    ]
  );

  return <MultiStrikeContext.Provider value={contextValue}>{children}</MultiStrikeContext.Provider>;
};

export default MultiStrikeContext;
