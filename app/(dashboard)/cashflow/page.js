'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import './global.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


//-----GRAPH COMPONENTS----------
const MoneyFlowGraph = dynamic(() => import('@/component/MoneyFlow-Graphs/MoneyFlow-Graph'), { ssr: false });
const ActiveMoneyFlow = dynamic(() => import('@/component/MoneyFlow-Graphs/ActiveMoneyFlow-Graph'), { ssr: false });
const CandleChart = dynamic(() => import('@/component/MoneyFlow-Graphs/CandleChart-Graph'), { ssr: false });
const MacdIndicator = dynamic(() => import('@/component/MoneyFlow-Graphs/MacdIndicator-Graph'), { ssr: false });
import { useAppSelector } from '@/store';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'), { ssr: false });

const Page = () => {
  const selectedColorForMoneyFlow = [];
  const selectedColorForNetMoneyFlow = [];
  const { handleResponceError } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedScript, setSelectedScript] = useState('');
  const [allData, setAllData] = useState('');
  const [allDates, setAllDates] = useState('');
  const [allScript, setAllScript] = useState('');
  const [loading, setLoading] = useState(true);
  const [allStockLoading, setAllStockLoading] = useState(true);
  const [data, setData] = useState('');
  const authState = useAppSelector((state) => state.auth.authState);
  const [selectedColors, setSelectedColors] = useState('');
  const [stockCallPremiumDecay, setStockCallPremiumDecay] = useState([]);
  const [stockPutPremiumDecay, setStockPutPremiumDecay] = useState([]);
  const [selectedNavItem, setSelectedNavItem] = useState('MACD');

  // buy sell states-------
  const [buySellData, setBuySellData] = useState([]);
  const [macdData, setMacdData] = useState([]);
  // const [minMacdh,setMinMACDh] =useState(0);
  // const [maxMacdh,setMaxMACDh] =useState(0);

  const getModifyResponce = (aValue, aItem, aResponce) => {
    for (let i = 0; i < aResponce.length; i++) {
      let increase;
      if (i == 0) {
        increase = 'black';
        aValue.push(increase);
        continue;
      } else if (+aResponce[i][aItem] > +aResponce[i - 1][aItem]) {
        increase = 'green';
        aValue.push(increase);
        continue;
      } else if (+aResponce[i][aItem] < +aResponce[i - 1][aItem]) {
        increase = 'red';
        aValue.push(increase);
        continue;
      } else {
        aValue.push('black');
      }
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      let apiUrl = `
${API_ROUTER.CASH_FLOW_TOP_TEN}`;

      const response = await axiosInstance.get(
        selectedDate && selectedScript ? (apiUrl += `?date=${selectedDate}&symbol=${selectedScript}`) : apiUrl
        ,
        {
          headers: { Authorization: `Bearer ${authState.access}` }
        }
      );
      if (response.status == 200) {
        if (!allDates && !selectedDate && !selectedScript) {
          setAllDates(response?.data?.dates);
          setAllScript(response?.data?.symbols);
          setSelectedDate(response?.data?.dates[0]);
          setSelectedScript(response?.data?.symbols?.find((item) => item === 'HDFCBANK'));
          setLoading(false);
          return;
        }

        getModifyResponce(selectedColorForMoneyFlow, 'money_flow', response?.data);
        getModifyResponce(selectedColorForNetMoneyFlow, 'net_money_flow', response?.data);
        setSelectedColors({
          moneyFlowColors: selectedColorForMoneyFlow.reverse(),
          netMoneyFlowColors: selectedColorForNetMoneyFlow.reverse()
        });
        setData(response?.data);

        setLoading(false);
      } else {
        router.push('/login');
      }
    } catch (err) {
      handleResponceError();
    }
  };
  const getAllStocks = async () => {
    try {
      setAllStockLoading(true);
      let apiUrl = `
${API_ROUTER.CASH_FLOW_ALL}`;
      const response = await axiosInstance.get((apiUrl += `?date=${selectedDate}`)
        , {
          headers: { Authorization: `Bearer ${authState.access}` }
        }
      );
      if (response.status == 200) {
        setAllData(response?.data);
        setLoading(false);
      } else {
        router.push('/login');
      }
      setAllStockLoading(false);
    } catch (err) {
      handleResponceError();
    }
  };
  // -----------BUY SELL CALL FOR CANDLE AND MACD----------------
  const buySellCall = async () => {
    try {
      if (!selectedDate) {
        return;
      }
      let apiUrl = `${API_ROUTER.CANDLE_AND_MACD}`;
      const response = await axiosInstance.get(apiUrl, {
        params: {
          symbol: selectedScript,
          date: selectedDate
        },
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setBuySellData(response.data);
      setMacdData(response.data);
    } catch (error) {
      handleResponceError();
    }
  };

  // -----------------------STOCK PREMIUMDECAY TABLE---------------
  const getStockPremiumDecay = async () => {
    if (!selectedScript) {
      return;
    }
    try {
      let apiUrl = `${API_ROUTER.STOCK_PREMIUMDECAY}`;
      const response = await axiosInstance.get(apiUrl += `?symbol=${selectedScript}`
        , {
          headers: { Authorization: `Bearer ${authState.access}` }
        }
      );
      setStockCallPremiumDecay(response.data?.call_premium_decay);
      setStockPutPremiumDecay(response.data?.put_premium_decay);
    } catch (err) {

    }

  }

  useEffect(() => {
    authState && getData();
    buySellCall();
    getStockPremiumDecay();
  }, []);

  useEffect(() => {
    buySellCall();
  }, [selectedScript, selectedDate]);

  useEffect(() => {
    if (selectedScript) {
      getData();
      getStockPremiumDecay();
    }
  }, [selectedScript]);

  useEffect(() => {
    if (selectedDate) {
      getData();
      getAllStocks();
    }
  }, [selectedDate]);

  const handleNavItemClick = (item) => {
    setSelectedNavItem(item);
  };

  const refreshData = () => {
    getData();
    getAllStocks();
    buySellCall();
  };
  const filterByStockAndDate = (event, isDateDropdown) => {
    isDateDropdown ? setSelectedDate(event) : setSelectedScript(event.target.value);
  };


  return (
    <>
      <div>
        {allStockLoading ? (
          <div className="loading-container">
            <PropagateLoader color="#33a3e3" loading={allStockLoading} size={15} />
          </div>
        ) : (
          <div className="graph-container">
            <div className="graph-div-cashFlow">
              {allData?.stock_data && <ActiveMoneyFlow title={'Stock'} data={allData?.stock_data} layout="vertical" />}
            </div>
            <div className="graph-div-cashFlow">
              {allData?.fno_data && <ActiveMoneyFlow title={'FNO'} data={allData?.fno_data} layout='horizontal' />}
            </div>
          </div>
        )}
        <div className="flex-container">
          <div className="dropdown-container">
            <h1 className="table-title1">SELECT DATE :</h1>
            <div className="calender-dropdown">
              <DatePicker
                showIcon
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                    <mask id="ipSApplication0">
                      <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
                        <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                        <path
                          fill="#fff"
                          d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                        ></path>
                      </g>
                    </mask>
                    <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSApplication0)"></path>
                  </svg>
                }
                selected={selectedDate}
                dateFormat="yyyy-MM-dd"
                onChange={(date) => {
                  const formattedDate = date.toISOString().split('T')[0];
                  filterByStockAndDate(formattedDate, true);
                }}
                includeDates={allDates}
                placeholderText="Select a date"
                customInput={<input readOnly />}
                shouldCloseOnSelect
              />
            </div>
          </div>
          <div className="dropdown-container">
            <h1 className="table-title1">SELECT SCRIPT :</h1>
            <select value={selectedScript} onChange={(e) => filterByStockAndDate(e, false)} className="stock-dropdown">
              {allScript &&
                allScript.map((stockData, index) => (
                  <option key={index} value={stockData}>
                    {stockData}
                  </option>
                ))}
            </select>
          </div>
          <button className="refresh-button2" onClick={() => refreshData()}>
            Refresh
          </button>
        </div>
        <navbar className='component-nav'>
          {['MACD', 'DECAY', 'MONEYFLOW'].map((item, index) => (
            <span key={index} onClick={() => handleNavItemClick(item)} className={item == selectedNavItem ? 'component-nav-active' : 'component-nav-deactive'} >
              {item}
            </span>
          ))}
        </navbar>
        {loading ? (
          <div className="loading-container">
            <PropagateLoader color="#33a3e3" loading={loading} size={15} />
          </div>
        ) : (
          <>
            {selectedNavItem === 'MACD' && (
              <>
                <div className="grand-div">{macdData && <MacdIndicator macdData={macdData} />}</div>
                <div className="grand-div">{buySellData && <CandleChart candleData={buySellData} />}</div>
              </>
            )}
            {selectedNavItem === 'DECAY' && (
              <>
                <div>
                  <div className='callPullDecay'>
                    <h1 className="table-title1">EXPIRY DATE: {stockCallPremiumDecay && stockCallPremiumDecay[0]?.expiry_date}</h1>
                    <h1 className="table-title1"> CALL PREMIUM DECAY</h1>
                    <h1 className="table-title1">Underlying Value: {stockCallPremiumDecay && stockCallPremiumDecay[0]?.underlying_value}</h1>
                  </div>
                  <table className="table1">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">OI CHANGE</th>
                        <th className="table-header-cell">PRICE CHANGE</th>
                        <th className="table-header-cell">IV</th>
                        <th className="table-header-cell">OI</th>
                        <th className="table-header-cell">OI CHANGE %</th>
                        <th className="table-header-cell">STRIKE PRICE</th>
                        <th className="table-header-cell">PRICE CHANGE %</th>
                        <th className="table-header-cell">PRICE</th>
                        <th className="table-header-cell">TOTAL BUY QUANTITY</th>
                        <th className="table-header-cell">TOTAL SELL QUANTITY</th>
                        <th className="table-header-cell">TOTAL TRADE VOLUME</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stockCallPremiumDecay.map((item, index) => (
                        <tr key={index}>
                          <td className={item.change_in_oi < 0 ? 'text-red-500' : 'text-green-500'} >{item.change_in_oi}</td>
                          <td className={item.change_in_price < 0 ? 'text-red-500' : 'text-green-500'} >{item.change_in_price}</td>
                          <td >{item.iv}</td>
                          <td >{item.oi}</td>
                          <td className={item.percentage_change_in_oi < 0 ? 'text-red-500' : 'text-green-500'} >{item.percentage_change_in_oi}</td>
                          <td >{item.strike_price}</td>
                          <td className={item.percentage_change_in_price < 0 ? 'text-red-500' : 'text-green-500'} >{item.percentage_change_in_price}%</td>
                          <td >{item.price}</td>
                          <td >{item.total_buy_quantity.toLocaleString('en-IN')}</td>
                          <td >{item.total_sell_quantity.toLocaleString('en-IN')}</td>
                          <td >{item.total_trade_volume.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className='callPullDecay'>
                    <h1 className="table-title1">EXPIRY DATE: {stockPutPremiumDecay && stockPutPremiumDecay[0]?.expiry_date}</h1>
                    <h1 className="table-title1">PUT PREMIUM DECAY</h1>
                    <h1 className="table-title1">Underlying Value: {stockPutPremiumDecay && stockPutPremiumDecay[0]?.underlying_value}</h1>
                  </div>
                  <table className="table1">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">OI CHANGE</th>
                        <th className="table-header-cell">PRICE CHANGE</th>
                        <th className="table-header-cell">IV</th>
                        <th className="table-header-cell">OI</th>
                        <th className="table-header-cell">OI CHANGE %</th>
                        <th className="table-header-cell">STRIKE PRICE</th>
                        <th className="table-header-cell">PRICE CHANGE %</th>
                        <th className="table-header-cell">PRICE</th>
                        <th className="table-header-cell">TOTAL BUY QUANTITY</th>
                        <th className="table-header-cell">TOTAL SELL QUANTITY</th>
                        <th className="table-header-cell">TOTAL TRADE VOLUME</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stockPutPremiumDecay.map((item, index) => (
                        <tr key={index}>
                          <td className={item.change_in_oi < 0 ? 'text-red-500' : 'text-green-500'}>{item.change_in_oi}</td>
                          <td className={item.change_in_price < 0 ? 'text-red-500' : 'text-green-500'}>{item.change_in_price}</td>
                          <td>{item.iv}</td>
                          <td>{item.oi}</td>
                          <td className={item.percentage_change_in_oi < 0 ? 'text-red-500' : 'text-green-500'}>{item.percentage_change_in_oi}</td>
                          <td>{item.strike_price}</td>
                          <td className={item.percentage_change_in_price < 0 ? 'text-red-500' : 'text-green-500'}>{item.percentage_change_in_price}%</td>
                          <td>{item.price}</td>
                          <td >
                            {item.total_buy_quantity.toLocaleString('en-IN')}
                          </td>
                          <td >{item.total_sell_quantity.toLocaleString('en-IN')}</td>
                          <td >{item.total_trade_volume.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
            }
            {selectedNavItem === 'MONEYFLOW' && (<>
              <div>
                <div className="table-container1">
                  <table className="table1">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Time</th>
                        <th className="table-header-cell">Close</th>
                        <th className="table-header-cell">Open</th>
                        <th className="table-header-cell">High</th>
                        <th className="table-header-cell">Low</th>
                        <th className="table-header-cell">Average</th>
                        <th className="table-header-cell">
                          Volume<span className="in-thousand1">in thousand</span>
                        </th>
                        <th className="table-header-cell">
                          Money Flow<span className="in-thousand1">in thousand</span>
                        </th>
                        <th className="table-header-cell">
                          Net Money Flow<span className="in-thousand1">in thousand</span>
                        </th>
                      </tr>
                    </thead>
                    {data && (
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data
                          .slice()
                          .reverse()
                          .map((item, index) => {
                            return (
                              <tr key={item?.id}>
                                <td className="table-cell">{item?.time}</td>
                                <td className="table-cell">{item?.close}</td>
                                <td className="table-cell">{item?.open}</td>
                                <td className="table-cell">{item?.high}</td>
                                <td className="table-cell">{item?.low}</td>
                                <td className="table-cell">{item?.average}</td>
                                <td className="table-cell">{item?.volume}</td>
                                <td
                                  className={`table-cell ${selectedColors.netMoneyFlowColors[index] == 'green'
                                    ? 'text-green-500'
                                    : selectedColors.netMoneyFlowColors[index] == 'red'
                                      ? 'text-red-500'
                                      : ''
                                    }`}
                                >
                                  {item?.money_flow}
                                </td>
                                <td
                                  className={`table-cell ${selectedColors.netMoneyFlowColors[index] == 'green'
                                    ? 'text-green-500'
                                    : selectedColors.netMoneyFlowColors[index] == 'red'
                                      ? 'text-red-500'
                                      : ''
                                    }`}
                                >
                                  {item?.net_money_flow}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
              <div className="graph-cash-bottom">
                <MoneyFlowGraph data={data} />
              </div>
            </>
            )}


          </>
        )}
      </div>
    </>
  );
};

export default Page;
