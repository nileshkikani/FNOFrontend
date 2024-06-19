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
    } catch (error) {
      console.log('error calling signal api', error);
    }
  };

  const connectWebSocket = async (token) => {
    try {
      if (!token) {
        console.log('tnotfound');
        throw new Error('Token is required to connect WebSocket');
      }
      console.log('feedToken', token?.feedToken);

      await initializeWebSocket(token?.feedToken,setHDFC);
    } catch (error) {
      console.error('Error in authentication or setting up WebSocket:', error);
    }
  };

  useEffect(() => {
    connectWebSocket(socketToken); 
    getSignal();
  }, []);


  return (
    <div>
      check api response
      {HDFC} <br/>
      {HDFC && HDFC.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
    </div>
  );
};

export default Page;
