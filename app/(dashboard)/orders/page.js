'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import { initializeWebSocket } from '@/utils/socket';
import { useAppSelector } from '@/store';

const Page = () => {
  const authState = useAppSelector((state) => state.auth.authState);
  const socketToken = useAppSelector((state) => state.user.socketToken);
  const [HDFC, setHDFC] = useState(null);

  const getSignal = async () => {
    try {
      const response = await axiosInstance.get('/signal/orderupdate/?symbol=HDFC BANK', {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      console.log('Signal API response:', response.data); // Log response for debugging
    } catch (error) {
      console.error('Error calling signal API:', error);
    }
  };

  // const jd = (dd) => {
  //   console.log('hvhjdshjdvb=>>>', dd);
  //   setHDFC(dd);
  // };
  

  const connectWebSocket = async (token) => {
    try {
      if (!token) {
        console.log('Token not found');
        throw new Error('Token is required to connect WebSocket');
      }
      const feedToken = token?.feedToken;
      await initializeWebSocket(feedToken, null, null, null);
    } catch (error) {
      console.error('Error in getting live price or setting up WebSocket:', error);
    }
  };

  useEffect(() => {
    if (socketToken) {
      connectWebSocket(socketToken);
      getSignal();
    }
    // console.log('HDFC state:', HDFC);
  }, [socketToken]); // Run useEffect whenever socketToken changes

  useEffect(() => {
    console.log('HDFC state:', HDFC);
  }, [HDFC]);

  return (
    <div>
      <p>Check API response and live HDFC price:</p>
      <div>
        <label>
          Live HDFC price is:{' '}
          {HDFC !== null ? HDFC.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : 'Loading...'}
        </label>
      </div>
    </div>
  );
};

export default Page;
