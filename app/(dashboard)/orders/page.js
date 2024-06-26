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
  const [selectedScript, setSelectedScript] = useState('HDFC BANK');
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
          } catch (error) {
            console.log('error in patch req.', error);
          }
        }
      });
    }
  }, [HDFC, NIFTY, data]);

  const handleScriptChange = (e) => {
    setSelectedScript(e.target.value);
  };

  return (
    <div className="parent-div">
      <div>
        <p>Select Script</p>
        <select value={selectedScript} onChange={handleScriptChange}>
          <option value="HDFC BANK">HDFCBANK</option>
          <option value="NIFTY 50">NIFTY 50</option>
        </select>
        <div>
          <label>Live HDFC is: {HDFC !== null ? HDFC : 'Loading...'}</label> <br />
          <label>Live NIFTY is: {NIFTY !== null ? NIFTY : 'Loading...'}</label>
        </div>
      </div>
      {/* <table>
        <tr>
          <th colspan="2">Positions</th>
        </tr>
        <tr>
          <td>Position 1</td>
          <td>Details 1</td>
        </tr>
        <tr>
          <td>Position 2</td>
          <td>Details 2</td>
        </tr>
        <tr>
          <td>Position 3</td>
          <td>Details 3</td>
        </tr>
      </table> */}
      {closedOrders && <label className='title'>{`Day's history (${closedOrders.length})`}</label>}
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Sell Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {closedOrders.map((item) => (
            <tr key={item.id}>
              <td>{item.symbol}</td>
              <td>{item.sell_price.toFixed(2)}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
