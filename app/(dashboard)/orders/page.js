'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
// import dynamic from 'next/dynamic';
// import axios from 'axios';
import { socketForStocks } from '@/utils/socket';
import { useAppSelector } from '@/store';
import DataTable from 'react-data-table-component';
import './global.css';
// const TbCircleLetterBFilled = dynamic(() => import('react-icons/tb'));
// const TbCircleLetterSFilled = dynamic(() => import('react-icons/tb'));

// --------------ICONS--------------
import { TbSquareLetterS } from "react-icons/tb";
import { TbSquareLetterB } from "react-icons/tb";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";


const Page = () => {
  const authState = useAppSelector((state) => state.auth.authState);
  const socketToken = useAppSelector((state) => state.user.socketToken);
  const [data, setData] = useState([]);
  const [closedOrders, setClosedOrders] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [capital, setCapital] = useState(100000);
  // const [buyIcon,setBuyIcon] = useState(<TbCircleLetterBFilled size={20}/>)
  // const [sellIcon,setSellIcon] = useState(<TbCircleLetterSFilled size={20}/>)

  // console.log('hjhjh',buyIcon)

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

  console.log("mkmmkm", capital);
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
  }, [capital]);

  const refreshBtn = () => {
    getClosedOrders();
    getOpenOrders();
  };


  // console.log('dcd',capitalValueFromInput)

  const handleSubmit = (e) => {
    e.preventDefault();
    const capitalValueFromInput = document.getElementById('capital-id')?.value;
    setCapital(capitalValueFromInput);
  }

  const sortedOrders = closedOrders.slice().sort((a, b) => {
    const dateA = new Date(a.signal_time);
    const dateB = new Date(b.signal_time);
    return dateA - dateB;
  });


  const numberOfProfitableTrades = closedOrders.filter((item) => item.outcome == 'profit');
  const dispalyPtrades = numberOfProfitableTrades.length / closedOrders.length;

  return (
    <div className="parent-div">
      <div className='capital-div'>
        <div>
          <button className="refresh-button" onClick={refreshBtn}>
            Refresh
          </button>
              </div>
          <div>
            <div>
              <input
                id='capital-id'
                type='number'
                placeholder='Enter your capital'
                className='input-fld'
              // value={capital}
              // onChange={handleChange}
              />
              <button className="check-button" onClick={handleSubmit}>Check</button>
            </div>
          </div>
      </div>
      {openOrders.length > 0 && <label className='title'>{`Open Orders (${openOrders.length})`}</label>}
      <table >
        <thead>
          <tr>
            <th>Signal Time</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Buy Price</th>
            <th>Sell Price</th>
            <th>Stop Loss</th>
            <th>Target</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((item, index) => {
            const rowClass = index % 2 === 0 ? 'row-light-color' : 'row-dark-color';
            return (
              <tr key={item.id} className={rowClass}>
                <td className='td-cell'>{new Date(item?.signal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className='order-icon td-cell'>{item.type === 'buy' ? <TbSquareLetterB size={25} style={{ color: 'green' }} /> : <TbSquareLetterS size={25} style={{ color: 'red' }} />}</td>
                <td className='td-cell'>{item.symbol}</td>
                <td className='td-cell'>{item.buy_price}</td>
                <td className='td-cell'>{item.sell_price ? item.sell_price?.toFixed(2) : ''}</td>
                <td className='td-cell'>{item.stop_loss?.toFixed(2)}</td>
                <td className='td-cell'>{item.take_profit?.toFixed(2)}</td>
                <td className='td-cell'>{item.status}</td>
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
            <th>P/L</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((item, index) => {
            const buyPrice = parseFloat(item.buy_price);
            const sellPrice = parseFloat(item.sell_price);
            const percentageChange = ((sellPrice - buyPrice) / buyPrice) * 100;
            const priceDifference = sellPrice - buyPrice;
            const quantity = capital / buyPrice;
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
                <td className='td-cell'>{buyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td className='td-cell'>{quantity?.toFixed(0)}</td>
                <td className='td-cell'>{sellPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td className='td-cell'>{priceDifference.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                <td className={((sellPrice - buyPrice) * 100) < 0 ? 'red-text td-cell' : 'green-text td-cell'}>
                  {/* {((sellPrice - buyPrice) * 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })} */}
                  {(priceDifference.toLocaleString('en-IN', { maximumFractionDigits: 2 }) * quantity).toFixed(2)}
                </td>
                {/* <td>
                  {item.type === 'sell'
                    ? (item.sell_price * 100 - item.buy_price * 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })
                    : (item.buy_price * 100 - item.sell_price * 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </td> */}
                <td className='green-text td-cell'>{item.status === 'closed' && 'success'}</td>
                <td className='order-icon td-cell'>{item.outcome == 'loss' ? <FaArrowTrendDown size={18} style={{ color: 'red' }} /> : <FaArrowTrendUp size={18} style={{ color: 'green' }} />}{item.outcome}</td>
                <td className={percentageChange < 0 ? 'red-text td-cell' : 'green-text td-cell'}>{percentageChange.toFixed(2)}%</td>
              </tr>
            );
          })}
          {sortedOrders.length > 0 && (
            <tr>
              <td colSpan="7" className='td-cell'><strong>Total:</strong></td>
              <td className={calculateTotalAmount() < 0 ? 'red-text total td-cell' : 'green-text total td-cell'}><strong>{calculateTotalAmount().toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></td>
              <td colSpan="3" className='td-cell'></td>
              <td className={calculateTotalPercentageChange().toFixed(2) < 0 ? 'red-text total td-cell' : 'green-text total td-cell'}><strong>{calculateTotalPercentageChange().toFixed(2)}%</strong></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
