'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useCallback, useMemo, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';

export const MultiStrikeContext = createContext({});

const initialState = {
  data: [],
  isLoading: true,
  strikes: [],
  strikePrice1: [],
  strikePrice2: [],
  strikePrice3: [],
  strikePrice4: [],
  strikePrice5: [],
  selectedStrikePrices: []
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
      return { ...state, strikePrice1: action.payload.strikePrice1 };
    case 'SET_STRIKE_2':
      return { ...state, strikePrice2: action.payload.strikePrice2 };
    case 'SET_STRIKE_3':
      return { ...state, strikePrice3: action.payload.strikePrice3 };
    case 'SET_STRIKE_4':
      return { ...state, strikePrice4: action.payload.strikePrice4 };
    case 'SET_STRIKE_5':
      return { ...state, strikePrice5: action.payload.strikePrice5 };
    case 'ADD_SELECTED_STRIKE':
      return {
        ...state,
        selectedStrikePrices: [...state.selectedStrikePrices, action.payload]
      };
    case 'REMOVE_SELECTED_STRIKE':
      return {
        ...state,
        selectedStrikePrices: state.selectedStrikePrices.filter((price) => price !== action.payload)
      };
      case 'REMOVE_ALL':
        return{
          ...state,selectedStrikePrices:action.payload
        }
    default:
      return state;
  }
};


export const MultiStrikeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { handleResponceError } = useAuth();
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
    strikePrice5
    // strikePrice1IsChecked,
    // strikePrice2IsChecked,
    // strikePrice3IsChecked,
    // strikePrice4IsChecked,
    // strikePrice5IsChecked
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
      handleResponceError();
    }
  };

  useEffect(() => {
    const uniqueStrikePrices = [...new Set(data?.map((item) => item?.strike_price))];
    dispatch({ type: 'SET_STRIKES', payload: uniqueStrikePrices });
  }, [data]);

  // -------storing selected strike---------
  const checkSelectedStrike = (e, identifier) => {
    const filteredData = data?.filter((itm) => itm?.strike_price == `${e.target.value}`);
    const { value, checked } = e.target;
    if (checked) {
      dispatch({ type: 'ADD_SELECTED_STRIKE', payload: value });
    } else {
      dispatch({ type: 'REMOVE_SELECTED_STRIKE', payload: value });
    }

    switch (identifier) {
      case 1:
        // setStrikePrice1(filteredData);
        dispatch({ type: 'SET_STRIKE_1', payload: { strikePrice1: e.target.checked ? [...filteredData] : [] } });
        break;
      case 2:
        dispatch({ type: 'SET_STRIKE_2', payload: { strikePrice2: e.target.checked ? [...filteredData] : [] } });
        break;
      case 3:
        dispatch({ type: 'SET_STRIKE_3', payload: { strikePrice3: e.target.checked ? [...filteredData] : [] } });
        break;
      case 4:
        dispatch({ type: 'SET_STRIKE_4', payload: { strikePrice4: e.target.checked ? [...filteredData] : [] } });
        break;
      case 5:
        dispatch({ type: 'SET_STRIKE_5', payload: { strikePrice5: e.target.checked ? [...filteredData] : [] } });
        break;
      default:
        break;
    }
  };

  const whenComponentUnmount = () => {
    dispatch({ type: 'SET_STRIKE_1', payload: { strikePrice1: [] } });
    dispatch({ type: 'SET_STRIKE_2', payload: { strikePrice2: [] } });
    dispatch({ type: 'SET_STRIKE_3', payload: { strikePrice3: [] } });
    dispatch({ type: 'SET_STRIKE_4', payload: { strikePrice4: [] } });
    dispatch({ type: 'SET_STRIKE_5', payload: { strikePrice5: [] } });
    dispatch({ type: 'REMOVE_ALL', payload: [] });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      strikes,
      multiStrikeAPiCall,
      checkSelectedStrike,
      whenComponentUnmount,
      // selectedStrikePrices,
      strikePrice1,
      strikePrice2,
      strikePrice3,
      strikePrice4,
      strikePrice5
      // strikePrice1IsChecked,
      // strikePrice2IsChecked,
      // strikePrice3IsChecked,
      // strikePrice4IsChecked,
      // strikePrice5IsChecked
    }),
    [
      state,
      strikes,
      multiStrikeAPiCall,
      data,
      checkSelectedStrike,
      whenComponentUnmount,
      // selectedStrikePrices,
      strikePrice1,
      strikePrice2,
      strikePrice3,
      strikePrice4,
      strikePrice5
      // strikePrice1IsChecked,
      // strikePrice2IsChecked,
      // strikePrice3IsChecked,
      // strikePrice4IsChecked,
      // strikePrice5IsChecked
    ]
  );

  return <MultiStrikeContext.Provider value={contextValue}>{children}</MultiStrikeContext.Provider>;
};

export default MultiStrikeContext;
