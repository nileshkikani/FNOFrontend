'use client';
import React, { useEffect, useState,useMemo } from 'react';
import axiosInstance from '@/utils/axios';
import { initializeWebSocket } from '@/utils/socket';
import { useAppSelector } from '@/store';
import './global.css';
import useAuth from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { API_ROUTER } from '@/services/apiRouter';
import dynamic from 'next/dynamic';

// -----------DATE-PICKER STUFFS---------
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// --------------ICONS--------------
import { TbSquareLetterS } from "react-icons/tb";
import { TbSquareLetterB } from "react-icons/tb";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

const Page = () => {
  const authState = useAppSelector((state) => state.auth.authState);
  const socketToken = useAppSelector((state) => state.user.socketToken);
  const [closedOrders, setClosedOrders] = useState([]);
  // const [loading, isLoading] = useState(false);
  const [openOrders, setOpenOrders] = useState([]);
  const [capital, setCapital] = useState(100000);
  const [openOrdersTokens, setOpenOrdersToken] = useState([]);
  const [closedOrderLoading, setClosedOrderLoading] = useState(false);
  const [livePrices, setLivePrices] = useState({});
  const [selectedDate, setSelectedDate] = useState();
  const { handleResponceError } = useAuth();



  // ------------SOCKET CONNECTION FOR LIVE PRICE DISPLAY------------
  const connectWebSocket = async (socketToken) => {
    try {
      if (!socketToken) {
        throw new Error('Token is required to connect WebSocket');
      }
      // await initializeWebSocket(socketToken, null, null, null, setLivePrices, ['99926000', '99926009', ...openOrdersTokens]);
    } catch (error) {
      console.error('Error in authentication or setting up WebSocket:', error);
    }
  };

  // ---------------------GET CLOSED ORDERS----------------
  const getClosedOrders = async () => {
    try {
      setClosedOrderLoading(false);
      let baseUrl = `${API_ROUTER.FUTURE_UPDATE}?status=closed`;
      if (selectedDate) {
        baseUrl += `&date=${selectedDate}`
      }
      const response = await axiosInstance.get(baseUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setClosedOrders(response.data);
      if (response.data.length === 0) {
        toast.error('no data in closed orders');
      }
      setClosedOrderLoading(true);
    } catch (err) {
      handleResponceError();
    }
  };

  // ---------------------GET OPEN ORDERS----------------
  const getOpenOrders = async () => {
    try {
      // isLoading(false);
      let baseUrl = API_ROUTER.FUTURE_UPDATE;
      const response = await axiosInstance.get(`${baseUrl}?status=open`, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setOpenOrders(response.data);
      const tokens = response.data.map(order => order.token);
      setOpenOrdersToken(tokens);
      // isLoading(true);
    } catch (err) {
      handleResponceError();
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
    sortedOrders.forEach((item) => {
      const buyPrice = parseFloat(item.buy_price);
      const sellPrice = parseFloat(item.sell_price);
      const priceDifference = sellPrice - buyPrice;
      const quantity = capital / buyPrice;
      totalAmount += Math.trunc(priceDifference) * Math.trunc(quantity);
    });
    const afterTrunc = Math.trunc(totalAmount);
    return afterTrunc;
  };

  useEffect(() => {
    // setSelectedDate('')
    getClosedOrders();
    getOpenOrders();
  }, []);

  useEffect(() => {
    selectedDate && getClosedOrders();
  }, [selectedDate])

  useEffect(() => {
    if (socketToken && openOrdersTokens.length > 0) {
      connectWebSocket(socketToken);
    }
  }, [socketToken, openOrdersTokens]);

  const refreshBtn = () => {
    getClosedOrders();
    getOpenOrders();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const capitalValueFromInput = document.getElementById('capital-id')?.value;
    if (!capitalValueFromInput) {
      toast.error('Please enter your capital');
      return;
    }
    const parsedCapital = parseFloat(capitalValueFromInput);
    setCapital(parsedCapital);
  };

  const calculatePL = (item) => {
    const livePrice = parseFloat(livePrices[item.token]);
    const buyPrice = parseFloat(item.buy_price);
    const sellPrice = parseFloat(item.sell_price);

    let quantity = 0;
    let pl = 0;

    if (sellPrice === null || isNaN(sellPrice)) {
      // -----BUY ORDERS----
      quantity = capital / buyPrice;
      pl = (livePrice - buyPrice) * quantity;
      // }
    } else if (buyPrice === null || isNaN(buyPrice)) {
      // -----SELL ORDERS----
      quantity = capital / sellPrice;
      pl = (sellPrice - livePrice) * quantity;
    }

    return pl;
  };

  const sortedOrders = useMemo(() => {
    return closedOrders.slice().sort((a, b) => new Date(a.signal_time) - new Date(b.signal_time));
  }, [closedOrders]);


  const calculateTotalPL = () => {
    const total = openOrders.reduce((total, item) => total + calculatePL(item), 0);
    return isNaN(total) ? '0.00' : total.toFixed(2);
  };

  const numberOfProfitableTrades = closedOrders.filter((item) => item.outcome == 'profit');
  const dispalyPtrades = numberOfProfitableTrades.length / closedOrders.length;


  // console.log('datttte', selectedDate);

  const handleDateChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);
    }
  };

  return (
    <div className="parent-div">
      <div className='capital-div'>
        <div>
          <button className="refresh-button" onClick={refreshBtn}>
            Refresh
          </button>
        </div>
        <div>
          <div className='capital'>
            <input
              id='capital-id'
              type='number'
              placeholder='Enter your capital'
              className='input-fld'
            />
            <button className="check-button" onClick={handleSubmit}>Check</button>
          </div>
        </div>
      </div>
      {/* -----------------OPEN ORDERS------------ */}
      {openOrders.length > 0 && <label className='title'>{`Open Orders (${openOrders.length})`}</label>}
      <table>
        <thead>
          <tr>
            <th>Duration</th>
            <th>Signal Time</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Qty</th>
            <th>Spot Price</th>
            <th>TG1</th>
            <th>TG2</th>
            <th>TG3</th>
            <th>TG4</th>
            <th>SL</th>
            <th>Indicator</th>
            <th>Status</th>
            <th>P/L</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((item, index) => {
            const rowClass = index % 2 === 0 ? 'row-light-color' : 'row-dark-color';
            const buyPrice = parseFloat(item.buy_price);
            const livePrice = parseFloat(livePrices[item.token])
            const sellPrice = parseFloat(item.sell_price);

            const quantity = buyPrice > 0 ? capital / buyPrice : sellPrice > 0 ? capital / sellPrice : 0;
            // const currentPrice = buyPrice > 0 ? livePrice : sellPrice;
            const pl = calculatePL(item);

            return (
              <tr key={item.id} className={rowClass}>
                <td className='td-cell'>
                  {item.duration === 'FIVE_MINUTE' ? '5 minutes' : item.duration === 'FIFTEEN_MINUTE' ? '15 minutes' : ''}
                </td>
                <td className='td-cell'>{new Date(item?.signal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className='order-icon td-cell'>
                  {item.type === 'buy' ? <TbSquareLetterB size={25} style={{ color: 'green' }} /> : <TbSquareLetterS size={25} style={{ color: 'red' }} />}
                </td>
                <td className='td-cell'>{item?.symbol}</td>
                <td className='td-cell'>{item?.buy_price}</td>
                <td className='td-cell'>{item?.sell_price ? item.sell_price?.toFixed(2) : ''}</td>
                <td className='td-cell'>{item?.lot_size}</td>
                <td className='td-cell'>{item?.spot_price ? item.spot_price?.toFixed(2) : ''}</td>
                <td className='td-cell'>{item?.tg1?.toFixed(2)}</td>
                <td className='td-cell'>{item?.tg2?.toFixed(2)}</td>
                <td className='td-cell'>{item?.tg3?.toFixed(2)}</td>
                <td className='td-cell'>{item?.tg4?.toFixed(2)}</td>
                <td className='td-cell'>{item?.sl?.toFixed(2)}</td>
                <td className='td-cell'>{item?.indicator}</td>
                <td className='td-cell'>{item?.status}</td>
                <td className={isNaN(pl) || pl < 0 ? 'red-text td-cell' : 'green-text td-cell'}>
                  {isNaN(pl) ? '0' : pl.toFixed(2)}
                </td>

              </tr>
            );
          })}
          {openOrders.length > 0 && (
            <tr>
              <td colSpan="12">
                Total P/L
              </td>
              <td className={calculateTotalPL() < 0 ? 'red-text td-cell' : 'green-text td-cell'}>
                {calculateTotalPL()}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className='exec-trades-div'>
        {numberOfProfitableTrades && closedOrders &&
          <label className='title'>Executed Trades ({numberOfProfitableTrades.length}/{closedOrders.length})</label>}
        <label>
          Profitable trade ratio is{' '}
          {isNaN(dispalyPtrades) ? (
            <span className='title'>0.00%</span>
          ) : (
            <span className='title'>{(dispalyPtrades * 100).toFixed(2)}%</span>
          )}
        </label>
        <div className='date-div'>
          <label className='title'>Trade History:</label>
          <div className='thedate'>
            <DatePicker
              showIcon
              maxDate={new Date() + 1}
              dateFormat="yyyy-MM-dd"
              onChange={handleDateChange}
              selected={selectedDate}
              placeholderText="Select a date"
              customInput={<input readOnly />}
              shouldCloseOnSelect
              onKeyDown={(e) => {
                e.preventDefault();
              }}
            />
          </div>
        </div>
      </div>
      {closedOrderLoading ?
        <table >
          <thead >
            <tr>
              <th>Duration</th>
              <th>Time</th>
              <th>Type</th>
              <th>Stock</th>
              <th>Buy Price</th>
              <th>Qty</th>
              <th>Sell Price</th>
              <th>Price Difference</th>
              <th>Spot Price</th>
              <th>Status</th>
              <th>Indicator</th>
              <th>Close Duration</th>
              <th>P/L</th>
              <th>%</th>
            </tr>
          </thead>
          {/* -------------EXECUTED ORDERS-------------- */}
          <tbody>
            {sortedOrders.map((item, index) => {
              const buyPrice = item.buy_price;
              const sellPrice = item.sell_price;
              const quantity = item?.lot_size;
              const priceDifference = sellPrice - buyPrice;

              let percentageChange;

              if (item.type === 'buy') {
                percentageChange = ((sellPrice - buyPrice) / buyPrice) * 100;
              } else {
                percentageChange = ((sellPrice - buyPrice) / sellPrice) * 100;
              }

              let durationText;
              if (item.duration === "ONE_HOUR") {
                durationText = "1 hour";
              } else {
                durationText = item.duration === "FIVE_MINUTE" ? "5 minutes" : "15 minutes";
              }

              const rowClass = index % 2 === 0 ? 'row-light-color' : 'row-dark-color';
              return (
                <tr key={item.id} className={rowClass}>
                  <td className='td-cell'>{durationText}</td>
                  <td className='td-cell'>{new Date(item?.signal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className='order-icon td-cell'>
                    {item.type === 'buy' ? <TbSquareLetterB size={25} style={{ color: 'green' }} /> : <TbSquareLetterS size={25} style={{ color: 'red' }} />}
                  </td>
                  <td className='td-cell'>{item.symbol}</td>
                  <td className='td-cell'>{Math.trunc(buyPrice)}</td>
                  <td className='td-cell'>{Math.trunc(quantity)}</td>
                  <td className='td-cell'>{Math.trunc(sellPrice)}</td>
                  <td className='td-cell'>{Math.trunc(priceDifference)}</td>
                  <td className={(priceDifference * quantity) < 0 ? 'red-text td-cell' : 'green-text td-cell'}>
                    {(Math.trunc(priceDifference) * Math.trunc(quantity))}
                  </td>
                  <td className='green-text td-cell'>{item.status === 'closed' && 'success'}</td>
                  <td className='td-cell'>{item.indicator}</td>
                  <td className='td-cell'>{item.close_duration}</td>
                  <td className='order-icon td-cell'>
                    {item.outcome === 'loss' ? <FaArrowTrendDown size={18} style={{ color: 'red' }} /> : <FaArrowTrendUp size={18} style={{ color: 'green' }} />}
                    {item.outcome}
                  </td>
                  <td className={percentageChange < 0 ? 'red-text td-cell' : 'green-text td-cell'}>
                    {percentageChange.toFixed(2)}%
                  </td>
                </tr>
              );
            })}

            {sortedOrders.length > 0 && (
              <tr>
                <td colSpan="8" className='td-cell'><strong>Total:</strong></td>
                <td className={isNaN(calculateTotalAmount()) || calculateTotalAmount() < 0 ? 'red-text total td-cell' : 'green-text total td-cell'}>
                  <strong>{isNaN(calculateTotalAmount()) ? 0 : calculateTotalAmount()}</strong>
                </td>
                <td colSpan="4" className='td-cell'></td>
                <td className={isNaN(calculateTotalPercentageChange().toFixed(2)) || calculateTotalPercentageChange().toFixed(2) < 0 ? 'red-text total td-cell' : 'green-text total td-cell'}>
                  <strong>{isNaN(calculateTotalPercentageChange().toFixed(2)) ? '0.00%' : calculateTotalPercentageChange().toFixed(2) + '%'}</strong>
                </td>
              </tr>
            )}
          </tbody>
          
        </table>: (<>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh'
              }}
            >
              <PropagateLoader color="#33a3e3" loading={!closedOrderLoading} size={15} />
            </div>
          </>
          )}
    </div>
  );
};

export default Page;
