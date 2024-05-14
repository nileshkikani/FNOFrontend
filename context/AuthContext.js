'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAuthState } from '@/store/authSlice';
import { useAppSelector } from '@/store';
import Cookie from 'js-cookie';

export const AuthContext = createContext({});

const initialState = {
  data: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const storeDispatch = useDispatch();
  const { data } = state;
  const authState = useAppSelector((state) => state.auth.authState);

  // ---------LOGIN API CALL---------
  const getData = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post(`${API_ROUTER.LOGIN}`, {
        email: email,
        password: password
      });
      if (response.status === 200) {
        dispatch({
          type: 'SET_DATA',
          payload: response.data
        });
        storeDispatch(
          setAuthState({
            access: response.data?.tokens?.access ? response.data?.tokens?.access : '',
            refresh: response.data?.tokens?.refresh ? response.data?.tokens?.refresh : ''
          })
        );
        // console.log("inside login->",authState.access);
        // console.log("inside login->",authState.refresh);
        Cookie.set('access', response.data.tokens?.access);
        Cookie.set('refresh', response.data.tokens?.refresh);

        router.push('/activeoi');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.log('Error while login', error);
    }
  };

  // -----------GET NEW REFRESH TOKEN AND STORING AFTER EVERY 55 MINS from handleSubmit function------------
  const refreshToken = async () => {
    // console.log('inside refresh token function');
    // console.log('this is acces tokem', authState.access);
    // console.log('this is refreshhh tokem', authState.refresh);
    // console.log('this is authstatee===', authState);

    const refreshToken = Cookie.get('refresh');
    const accessToken = Cookie.get('access');
    try {
      const newRefreshToken = await axiosInstance.post(
        API_ROUTER.REFRESH_TOKEN,
        { refresh: refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      Cookie.set('access', newRefreshToken.data.tokens.access);
      storeDispatch(
        setAuthState({
          ...authState,
          access: newRefreshToken?.data?.tokens?.access ? newRefreshToken?.data?.tokens?.access : ''
        })
      );
    } catch (error) {
      console.log('error getting refresh token', error);
    }
  };

  return <AuthContext.Provider value={{ ...state, data, getData, refreshToken }}>{children}</AuthContext.Provider>;
};
