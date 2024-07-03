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

  // -------------STOCK STATES----------
  const stockStates = {
    TATAMOTORS: useState(null),
    SBIBANK: useState(null),
    HDFCBANK: useState(null),
    RELIANCE: useState(null),
    ICICIBANK: useState(null),
    INFOSYS: useState(null),
    TCS: useState(null),
    LT: useState(null),
    ITC: useState(null),
    AXISBANK: useState(null),
    AIRTEL: useState(null),
    BAJAJFINANCE: useState(null),
    HINDUNILVR: useState(null),
    KOTAKBANK: useState(null),
    MARUTI: useState(null),
    HDFCAMC: useState(null),
    INDUSINDBK: useState(null),
    ADANIENT: useState(null),
    TECHM: useState(null),
  };

  // const [HDFC, setHDFC] = useState(null);
  // const [Reliance, setReliance] = useState(null);
  // const [Icici, setIcici] = useState(null);
  // const [Infosys, setInfosys] = useState(null);
  // const [Tcs, setTcs] = useState(null);
  // const [Lt, setLt] = useState(null);
  // const [Itc, setItc] = useState(null);
  // const [AxisBank, setAxisBank] = useState(null);
  // const [Sbi, setSbi] = useState(null);
  // const [Airtel, setAirtel] = useState(null);
  // const [BajajFinance, setBajajFinance] = useState(null);
  // const [HindustanUnilever, setHindustanUnilever] = useState(null);
  // const [TataMotors, setTataMotors] = useState(null);
  // const [KotakBank, setKotakBank] = useState(null);
  // const [Maruti, setMaruti] = useState(null);
  // const [HdfcAmc, setHdfcAmc] = useState(null);
  // const [IndusindBank, setIndusindBank] = useState(null);
  // const [AdaniEnterprise, setAdaniEnterprise] = useState(null);
  // const [TechMahindra, setTechMahindra] = useState(null);

  // const allStocks = {
  //   HDFCBANK: "1333",
  //   RELIANCE: "2885",
  //   ICICIBANK: "4963",
  //   INFOSYS: "1594",
  //   TCS: "11536",
  //   LT: "11483",
  //   ITC: "1660",
  //   AXISBANK: "5900",
  //   SBIBANK: "3045",
  //   AIRTEL: "10604",
  //   BAJAJFINANCE: "317",
  //   HINDUNILVR: '1394',
  //   TATAMOTORS: '3456',
  //   KOTAKBANK: '1922',
  //   MARUTI: '10999',
  //   HDFCAMC: '4244',
  //   INDUSINDBK: '5258',
  //   ADANIENT: '25',
  //   TECHM: '13538',
  // }

  const getSignal = async () => {
    try {
      const url = `signal/orderupdate/`;
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
        throw new Error('Token is required to connect WebSocket');
      }
      const feedToken = token?.feedToken;
      await socketForStocks(feedToken, ...Object.values(stockStates).map(([_, setState]) => setState));
      // await socketForStocks(feedToken,
      //   setHDFC,
      //   setReliance,
      //   setIcici,
      //   setInfosys,
      //   setTcs,
      //   setLt,
      //   setItc,
      //   setAxisBank,
      //   setSbi,
      //   setAirtel,
      //   setBajajFinance,
      //   setHindustanUnilever,
      //   setTataMotors,
      //   setKotakBank,
      //   setMaruti,
      //   setHdfcAmc,
      //   setIndusindBank,
      //   setAdaniEnterprise,
      //   setTechMahindra
      // );
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

  const calculateTotalPercentageChange = () => {
    let totalPercentageChange = 0;
    closedOrders.forEach((item) => {
      const buyPrice = parseFloat(item.buy_price);
      const sellPrice = parseFloat(item.sell_price);
      const percentageChange = ((sellPrice - buyPrice) / buyPrice) * 100;
      totalPercentageChange += percentageChange;
    });
    return totalPercentageChange;
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    closedOrders.forEach((item) => {
      const buyPrice = parseFloat(item.buy_price);
      const sellPrice = parseFloat(item.sell_price);
      const amount = (sellPrice - buyPrice) * 100;
      totalAmount += amount;
    });
    return totalAmount;
  };

  // const filterOrdersByTime = (orders) => {
  //   const filteredOrders = orders.filter(item => {
  //     const signalTime = new Date(item.signal_time);
  //     const hour = signalTime.getHours();
  //     return hour >= 10 && hour <= 15; 
  //   });
  //   return filteredOrders;
  // };
  // const filteredClosedOrders = filterOrdersByTime(closedOrders);
  

  useEffect(() => {
    if (socketToken) {
      connectWebSocket(socketToken);
    }
  }, [socketToken]);

  useEffect(() => {
    getSignal();
  }, []);

  useEffect(() => {
    getClosedOrders();
    getOpenOrders();
  }, []);

  useEffect(() => {
    Object.entries(stockStates).forEach(([symbol, [livePrice, setLivePrice]]) => {
      if (livePrice !== null && data.length > 0) {
        data.forEach((item) => {
          if (item.symbol === symbol) {
            if (livePrice <= item.stop_loss || livePrice >= item.take_profit) {
              const price = {};
              const url = `signal/orderupdate/${item.id}`;
              if (livePrice <= item.stop_loss) {
                price.price = item.stop_loss;
              } else if (livePrice >= item.take_profit) {
                price.price = item.take_profit;
              }
              try {
                axiosInstance.patch(url, price, {
                  headers: { Authorization: `Bearer ${authState.access}` }
                });
              } catch (error) {
                console.log('Error in patch request:', error);
              }
            }
          }
        });
      }
    });
  }, [data]);

  const refreshBtn = () => {
    getClosedOrders();
    getOpenOrders();
  };

  // console.log("klklklk",data)
  return (
    <div className="parent-div">
      <div>
        <button className="refresh-button" onClick={refreshBtn}>
          Refresh
        </button>
      </div>
      {openOrders.length > 0 && <label className='title'>{`Open Orders (${openOrders.length})`}</label>}
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Status</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((item) => (
            <tr key={item.id}>
              <td>{item.symbol}</td>
              <td>{item.buy_price}</td>
              <td>{item.sell_price ? item.sell_price.toFixed(2) : ''}</td>
              <td>{item.status}</td>
              <td>{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {closedOrders.length > 0 && <label className='title'>{`Day's History (${closedOrders.length})`}</label>}
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Price Difference</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Type</th>
            <th>P/L</th>
            <th>Time</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {closedOrders.map((item) => {
            const buyPrice = parseFloat(item.buy_price);
            const sellPrice = parseFloat(item.sell_price);
            const percentageChange = ((sellPrice - buyPrice) / buyPrice) * 100;
            const priceDifference = sellPrice - buyPrice;
            return (
              <tr key={item.id}>
                <td>{item.symbol}</td>
                <td>{buyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td>{sellPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td>{priceDifference.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td className={((sellPrice - buyPrice) * 100) < 0 ? 'red-text' : 'green-text'}>
                  {((sellPrice - buyPrice) * 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td>
                {/* <td>
                  {item.type === 'sell'
                    ? (item.sell_price * 100 - item.buy_price * 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })
                    : (item.buy_price * 100 - item.sell_price * 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td> */}
                <td>{item.status}</td>
                <td>{item.type}</td>
                <td>{item.outcome}</td>
                <td>{new Date(item?.signal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className={percentageChange < 0 ? 'red-text' : 'green-text'}>{percentageChange.toFixed(2)}%</td>
              </tr>
            );
          })}
          {closedOrders.length > 0 && (
            <tr>
              <td colSpan="4"><strong>Total:</strong></td>
              <td  className={calculateTotalAmount() < 0 ? 'red-text total' : 'green-text total'}><strong>{calculateTotalAmount().toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></td>
              <td colSpan="4"></td>
              <td className={calculateTotalPercentageChange().toFixed(2) < 0 ? 'red-text total' : 'green-text total'}><strong>{calculateTotalPercentageChange().toFixed(2)}%</strong></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
