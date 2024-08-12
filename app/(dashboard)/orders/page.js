'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import { socketForStocks,socketForOpenOrders } from '@/utils/socket';
import { useAppSelector } from '@/store';
import './global.css';
import useAuth from '@/hooks/useAuth';
import toast from 'react-hot-toast';


// --------------ICONS--------------
import { TbSquareLetterS } from "react-icons/tb";
import { TbSquareLetterB } from "react-icons/tb";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";


const Page = () => {
  const authState = useAppSelector((state) => state.auth.authState);
  const socketToken = useAppSelector((state) => state.user.socketToken);
  const [closedOrders, setClosedOrders] = useState([]);
  const [loading,isLoading] = useState(false);
  const [openOrders, setOpenOrders] = useState([]);
  const [capital, setCapital] = useState(100000);
  const [openOrdersTokens,setOpenOrdersToken] = useState([])
  const [livePrices, setLivePrices] = useState({});
  const { handleResponceError } = useAuth();


  const connectWebSocket = async (socketToken) => {
    try {
      if (!socketToken && openOrdersTokens.length>0) {
        throw new Error('Token is required to connect WebSocket');
      }
      await socketForStocks(socketToken?.feedToken, setLivePrices, ...openOrdersTokens);
      // console.log('socketCALL')
    } catch (error) {
      console.error('Error in authentication or setting up WebSocket:', error);
    }
  };

  // ---------------------GET CLOSED ORDERS----------------
  const getClosedOrders = async () => {
    try {
      let url = `signal/orderupdate/?status=closed`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setClosedOrders(response.data);
    } catch (err) {
      handleResponceError()
    }
  };

  // ---------------------GET OPEN ORDERS----------------
  const getOpenOrders = async () => {
    try {
      isLoading(false);
      let url = `signal/orderupdate/?status=open`;
      const response = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setOpenOrders(response.data);
      const tokens = response.data.map(order => order.token);
      setOpenOrdersToken(tokens);
      isLoading(true);
    } catch (err) {
      handleResponceError()
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
    getClosedOrders();
    getOpenOrders();
    // if (socketToken && openOrdersTokens) {
    //   connectWebSocket(socketToken);
    // }
  }, []);

  useEffect(()=>{
    if(openOrdersTokens && socketToken)connectWebSocket(socketToken)
  },[loading])

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
    setCapital(capitalValueFromInput);
  }


  const sortedOrders = closedOrders.slice().sort((a, b) => {
    const dateA = new Date(a.signal_time);
    const dateB = new Date(b.signal_time);
    return dateA - dateB;
  });


  const numberOfProfitableTrades = closedOrders.filter((item) => item.outcome == 'profit');
  const dispalyPtrades = numberOfProfitableTrades.length / closedOrders.length;


  // console.log('livePriceTOKenszz',livePrices)
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
      <table >
        <thead>
          <tr>
          <th>Duration</th>
            <th>Signal Time</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Live Price</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Stop Loss</th>
            <th>Target</th>
            <th>Indicator</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((item, index) => {
            const rowClass = index % 2 === 0 ? 'row-light-color' : 'row-dark-color';
            return (
              <tr key={item.id} className={rowClass}>
                                <td className='td-cell'>
                  {item.duration === 'FIVE_MINUTE' ? '5 minutes' : item.duration === 'FIFTEEN_MINUTE' ? '15 minutes' : ''}
                </td>
                <td className='td-cell'>{new Date(item?.signal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className='order-icon td-cell'>{item.type === 'buy' ? <TbSquareLetterB size={25} style={{ color: 'green' }} /> : <TbSquareLetterS size={25} style={{ color: 'red' }} />}</td>
                <td className='td-cell'>{item?.symbol}</td>
                <td className='td-cell'>{livePrices[item.token] ? livePrices[item.token]/100 : 'fetching...'}</td> 
                <td className='td-cell'>{item?.buy_price}</td>
                <td className='td-cell'>{item?.sell_price ? item.sell_price?.toFixed(2) : ''}</td>
                <td className='td-cell'>{item?.stop_loss?.toFixed(2)}</td>
                <td className='td-cell'>{item?.take_profit?.toFixed(2)}</td>
                <td className='td-cell'>{item?.indicator}</td>
                <td className='td-cell'>{item?.status}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
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
            <th>Amount</th>
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
            const quantity = capital / buyPrice;
            const percentageChange = ((sellPrice - buyPrice) / buyPrice) * quantity;
            const priceDifference = sellPrice - buyPrice;
            let durationText;
            if (item.duration === "ONE_HOUR") {
              durationText = "1 hour";
            } else {
              durationText = item.duration === "FIVE_MINUTE" ? "5 minutes" : "15 minutes";
            }
            const rowClass = index % 2 === 0 ? 'row-light-color' : 'row-dark-color';
            return (
              <tr key={item.id} className={rowClass} >
                <td className='td-cell'>{durationText}</td>
                <td className='td-cell'>{new Date(item?.signal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className='order-icon td-cell'>{item.type === 'buy' ? <TbSquareLetterB size={25} style={{ color: 'green' }} /> : <TbSquareLetterS size={25} style={{ color: 'red' }} />}</td>
                <td className='td-cell'>{item.symbol}</td>
                <td className='td-cell'>{Math.trunc(buyPrice)}</td>
                <td className='td-cell'>{Math.trunc(quantity)}</td>
                <td className='td-cell'>{Math.trunc(sellPrice)}</td>
                <td className='td-cell'>{Math.trunc(priceDifference)}</td>
                <td className={(priceDifference * quantity) < 0 ? 'red-text td-cell' : 'green-text td-cell'}>
                  {(Math.trunc(priceDifference) * Math.trunc(quantity))}
                </td>
                <td className='green-text td-cell'>{item.status === 'closed' && 'success'}</td>
                <td className='td-cell' >{item.indicator}</td>
                <td className='td-cell' >{item.close_duration}</td>
                <td className='order-icon td-cell'>{item.outcome == 'loss' ? <FaArrowTrendDown size={18} style={{ color: 'red' }} /> : <FaArrowTrendUp size={18} style={{ color: 'green' }} />}{item.outcome}</td>
                <td className={percentageChange < 0 ? 'red-text td-cell' : 'green-text td-cell'}>{percentageChange.toFixed(2)}%</td>
              </tr>
            );
          })}
          {sortedOrders.length > 0 && (
            <tr>
              <td colSpan="8" className='td-cell'><strong>Total:</strong></td>
              <td className={calculateTotalAmount() < 0 ? 'red-text total td-cell' : 'green-text total td-cell'}><strong>{calculateTotalAmount()}</strong></td>
              <td colSpan="4" className='td-cell'></td>
              <td className={calculateTotalPercentageChange().toFixed(2) < 0 ? 'red-text total td-cell' : 'green-text total td-cell'}><strong>{calculateTotalPercentageChange().toFixed(2)}%</strong></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
