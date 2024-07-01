'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
// import axios from 'axios';
import { socketForStocks } from '@/utils/socket';
import { useAppSelector } from '@/store';
import './global.css';

const Page = () => {
  const authState = useAppSelector((state) => state.auth.authState);
  const socketToken = useAppSelector((state) => state.user.socketToken);
  const [data, setData] = useState([]);
  const [closedOrders, setClosedOrders] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [selectedScript, setSelectedScript] = useState('HDFCBANK');
  const [HDFC, setHDFC] = useState(null);
  const [NIFTY, setNIFTY] = useState(null);

  const getSignal = async () => {
    try {
      const url = `signal/orderupdate/?symbol=${selectedScript}`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error calling signal API:', error);
    }
  };

  const connectWebSocket = async (token) => {
    try {
      if (!token) {
        console.log('Token not found');
        throw new Error('Token is required to connect WebSocket');
      }
      const feedToken = token?.feedToken;
      await socketForStocks(feedToken, setHDFC, setNIFTY);
    } catch (error) {
      console.error('Error in getting live price or setting up WebSocket:', error);
    }
  };

  // -------------get closed orders--------------
  const getClosedOrders = async () => {
    try {
      let url = `signal/orderupdate/?status=closed`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setClosedOrders(response.data);
    } catch (err) {
      console.log('error getting closed orders', err);
    }
  };

  // -------------------get open orders--------
  const getOpenOrders = async () => {
    try {
      let url = `signal/orderupdate/?status=open`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setOpenOrders(response.data);
    } catch (err) {
      console.log('error getting closed orders', err);
    }
  };

  useEffect(() => {
    if (socketToken) {
      connectWebSocket(socketToken);
    }
  }, [socketToken]);

  useEffect(() => {
    getSignal();
  }, [selectedScript]);

  useEffect(() => {
    getClosedOrders();
    getOpenOrders();
  }, []);

  useEffect(() => {
    if (HDFC !== null && data.length > 0) {
      data.forEach((item) => {
        if (HDFC <= item.stop_loss || HDFC >= item.take_profit) {
          const price = {};
          const url = `signal/orderupdate/${item.id}`;
          if (HDFC <= item.stop_loss) {
            price.price = item.stop_loss;
          } else if (HDFC >= item.take_profit) {
            price.price = item.take_profit;
          }
          // ----------------patch req for sending data in DB--------------
          try {
            const response = axiosInstance.patch(url, price, {
              headers: { Authorization: `Bearer ${authState.access}` }
            });
            console.log('patchcall');
          } catch (error) {
            console.log('error in patch req.', error);
          }
        }
      });
    }
  }, [data]);

  const handleScriptChange = (e) => {
    setSelectedScript(e.target.value);
  };

  return (
    <div className="parent-div">
      {/* <div>
        <p>Select Script</p>
        <select value={selectedScript} onChange={handleScriptChange}>
          <option value="HDFCBANK">HDFCBANK</option>
          <option value="NIFTY 50">NIFTY 50</option>
        </select>
        <div>
          <label>Live HDFC is: {HDFC !== null ? HDFC : 'Loading...'}</label> <br />
          <label>Live NIFTY is: {NIFTY !== null ? NIFTY : 'Loading...'}</label>
        </div>
      </div> */}
      {openOrders && <label className='title'>{`Open order's(${openOrders.length})`}</label>}
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Status</th>
            <th>Type</th>
            <th>P/L</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((item) => (
            <tr key={item.id}>
              <td>{item.symbol}</td>
              <td>{item.buy_price}</td>
              <td>{item.sell_price?.toFixed(2)}</td>
              <td>{item.status}</td>
              <td>{item.type}</td>
              <td>{item.outcome}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {closedOrders && <label className='title'>{`Day's history (${closedOrders.length})`}</label>}
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Status</th>
            <th>Type</th>
            <th>P/L</th>
          </tr>
        </thead>
        <tbody>
          {closedOrders.map((item) => (
            <tr key={item.id}>
              <td>{item.symbol}</td>
              <td>{item.buy_price?.toFixed(2)}</td>
              <td>{item.sell_price?.toFixed(2)}</td>
              <td>{item.status}</td>
              <td>{item.type}</td>
              <td>{item.outcome}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
