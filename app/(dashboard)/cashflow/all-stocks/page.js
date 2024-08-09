'use client'
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import '../global.css';
import useAuth from '@/hooks/useAuth';
import toast from 'react-hot-toast';


const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'), { ssr: false });
const CandleChart = dynamic(() => import('@/component/MoneyFlow-Graphs/CandleChart-Graph'), { ssr: false });
const MacdIndicator = dynamic(() => import('@/component/MoneyFlow-Graphs/MacdIndicator-Graph'), { ssr: false });
const MoneyFlowGraph = dynamic(() => import('@/component/MoneyFlow-Graphs/MoneyFlow-Graph'), { ssr: false });

const Page = () => {
    const { handleResponceError } = useAuth();
    const authState = useAppSelector((state) => state.auth.authState);
    const [loading, setLoading] = useState(true);
    const [allDates, setAllDates] = useState('');

    //------------------------PREMIUM DECAY STATES-----------------------
    const [stockCallPremiumDecay, setStockCallPremiumDecay] = useState([]);
    const [stockPutPremiumDecay, setStockPutPremiumDecay] = useState([]);
    const [decayLoading, setDecayLoading] = useState(false);

    const [buySellData, setBuySellData] = useState([]);
    const [selectedColors, setSelectedColors] = useState({
        moneyFlowColors: [],
        netMoneyFlowColors: []
    });
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedScript, setSelectedScript] = useState('');
    const [allScript, setAllScript] = useState([]);
    const [macdData, setMacdData] = useState([]);
    const router = useRouter();
    const [selectedNavItem, setSelectedNavItem] = useState('MACD');

    const getModifyResponse = (aValue, aItem, aResponse) => {
        for (let i = 0; i < aResponse.length; i++) {
            let increase;
            if (i === 0) {
                increase = 'black';
                aValue.push(increase);
            } else if (+aResponse[i][aItem] > +aResponse[i - 1][aItem]) {
                increase = 'green';
                aValue.push(increase);
            } else if (+aResponse[i][aItem] < +aResponse[i - 1][aItem]) {
                increase = 'red';
                aValue.push(increase);
            } else {
                aValue.push('black');
            }
        }
    };

    const getData = async () => {
        try {
            setLoading(true);
            let apiUrl = `${API_ROUTER.CASH_FLOW_TOP_TEN}`;
            const response = await axiosInstance.get(selectedDate && selectedScript ? `${apiUrl}?date=${selectedDate}&symbol=${selectedScript}` : apiUrl, {
                headers: { Authorization: `Bearer ${authState.access}` }
            });
            if (response.status === 200) {
                if (!allDates && !selectedDate && !selectedScript) {
                    setAllDates(response.data?.dates);
                    setAllScript(response.data?.symbols);
                    setSelectedDate(response.data?.dates[0]);
                    setSelectedScript(response.data?.symbols?.find((item) => item === 'HDFCBANK'));
                }
                const selectedColorForMoneyFlow = [];
                const selectedColorForNetMoneyFlow = [];
                getModifyResponse(selectedColorForMoneyFlow, 'money_flow', response.data);
                getModifyResponse(selectedColorForNetMoneyFlow, 'net_money_flow', response.data);
                setSelectedColors({
                    moneyFlowColors: selectedColorForMoneyFlow.reverse(),
                    netMoneyFlowColors: selectedColorForNetMoneyFlow.reverse()
                });
                setData(response.data);
            } else {
                router.push('/login');
            }
        } catch (error) {
            // console.log('Error in getData:', error);
            handleResponceError();
        } finally {
            setLoading(false);
        }
    };

    // -----------------------PREMIUM DECAY TABLES---------------------
    const getStockPremiumDecay = async () => {
        if (!selectedScript) return;
    
        setDecayLoading(false);
        
        const apiUrl = API_ROUTER.STOCK_PREMIUMDECAY;
    
        try {
            const response = await axiosInstance.get(`${apiUrl}?symbol=${selectedScript}`, {
                headers: { Authorization: `Bearer ${authState.access}` }
            });
    
            if (response.data?.call_premium_decay && response.data?.put_premium_decay) {
                setStockCallPremiumDecay(response.data?.call_premium_decay);
                setStockPutPremiumDecay(response.data?.put_premium_decay);
                setDecayLoading(true);
            } else {
                toast.error('No data for this symbol');
            }
        } catch (error) {
            if (error.response && error.response.status === 400 ) {
                toast.error(`${error.response.data.error}`);
            } else {
                handleResponceError();
            }
        }
    };
    
    

    // ----------------------MACD AND CANDLE CHART-----------------------
    const buySellCall = async () => {
        if (!selectedDate) return;
        try {
            let apiUrl = API_ROUTER.CANDLE_AND_MACD;
            const response = await axiosInstance.get(apiUrl, {
                params: { symbol: selectedScript, date: selectedDate },
                headers: { Authorization: `Bearer ${authState.access}` }
            });
            setBuySellData(response.data);
            setMacdData(response.data);
        } catch (error) {
            // console.log('Error in buySellCall:', error);
            handleResponceError();
        }
    };

    const refreshData = () => {
        getData();
        buySellCall();
    };

    useEffect(() => {
        getData();
        buySellCall();
    }, [selectedScript, selectedDate]);

    useEffect(() => {
        getStockPremiumDecay();
    }, [selectedScript])


    return (
        <>
            <div>
                <div className="flex-container">
                    <div className="dropdown-container-date">
                        <h1 className="table-date-text">SELECT DATE :</h1>
                        <div className="date-dropdown-all-stocks">
                            <DatePicker
                                selected={selectedDate}
                                dateFormat="yyyy-MM-dd"
                                onChange={(date) => setSelectedDate(date.toISOString().split('T')[0])}
                                includeDates={allDates}
                                placeholderText="Select a date"
                                customInput={<input readOnly />}
                                shouldCloseOnSelect
                            />
                        </div>
                    <div className="dropdown-container">
                        <h1 className="table-date-text">SELECT SCRIPT :</h1>
                        <select value={selectedScript} onChange={(e) => setSelectedScript(e.target.value)} className="stock-dropdown">
                            {allScript &&
                                allScript.map((stockData, index) => (
                                    <option key={index} value={stockData}>
                                        {stockData}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <button className="refresh-button2" onClick={refreshData}>
                        Refresh
                    </button>
                    </div>
                </div>
                <navbar className="component-nav">
                    {['MACD', 'DECAY', 'MONEYFLOW', 'PREDICTIONS'].map((item, index) => (
                        <span
                            key={index}
                            onClick={() => setSelectedNavItem(item)}
                            className={item === selectedNavItem ? 'component-nav-active' : 'component-nav-deactive'}
                        >
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
                        {selectedNavItem === 'DECAY' && decayLoading && (
                            <>
                                <div>
                                    <div className="callPullDecay">
                                        <h1 className="table-date-text">
                                            EXPIRY DATE: {stockCallPremiumDecay && stockCallPremiumDecay[0]?.expiry_date}
                                        </h1>
                                        <h1 className="table-date-text">CALL PREMIUM DECAY</h1>
                                        <h1 className="table-date-text">
                                            Underlying Value: {stockCallPremiumDecay && stockCallPremiumDecay[0]?.underlying_value}
                                        </h1>
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
                                                    <td className={item.change_in_oi < 0 ? 'text-red-500' : 'text-green-500'}>
                                                        {item.change_in_oi}
                                                    </td>
                                                    <td className={item.change_in_price < 0 ? 'text-red-500' : 'text-green-500'}>
                                                        {item.change_in_price}
                                                    </td>
                                                    <td>{item.iv}</td>
                                                    <td>{item.oi}</td>
                                                    <td className={item.percentage_change_in_oi < 0 ? 'text-red-500' : 'text-green-500'}>
                                                        {item.percentage_change_in_oi}
                                                    </td>
                                                    <td>{item.strike_price}</td>
                                                    <td className={item.percentage_change_in_price < 0 ? 'text-red-500' : 'text-green-500'}>
                                                        {item.percentage_change_in_price}%
                                                    </td>
                                                    <td>{item.price}</td>
                                                    <td>{item.total_buy_quantity.toLocaleString('en-IN')}</td>
                                                    <td>{item.total_sell_quantity.toLocaleString('en-IN')}</td>
                                                    <td>{item.total_trade_volume.toLocaleString('en-IN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <div className="callPullDecay">
                                        <h1 className="table-date-text">
                                            EXPIRY DATE: {stockPutPremiumDecay && stockPutPremiumDecay[0]?.expiry_date}
                                        </h1>
                                        <h1 className="table-date-text">PUT PREMIUM DECAY</h1>
                                        <h1 className="table-date-text">
                                            Underlying Value: {stockPutPremiumDecay && stockPutPremiumDecay[0]?.underlying_value}
                                        </h1>
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
                                                    <td className={item.change_in_oi < 0 ? 'text-red-500' : 'text-green-500'}>
                                                        {item.change_in_oi}
                                                    </td>
                                                    <td className={item.change_in_price < 0 ? 'text-red-500' : 'text-green-500'}>
                                                        {item.change_in_price}
                                                    </td>
                                                    <td>{item.iv}</td>
                                                    <td>{item.oi}</td>
                                                    <td className={item.percentage_change_in_oi < 0 ? 'text-red-500' : 'text-green-500'}>
                                                        {item.percentage_change_in_oi}
                                                    </td>
                                                    <td>{item.strike_price}</td>
                                                    <td className={item.percentage_change_in_price < 0 ? 'text-red-500' : 'text-green-500'}>
                                                        {item.percentage_change_in_price}%
                                                    </td>
                                                    <td>{item.price}</td>
                                                    <td>{item.total_buy_quantity.toLocaleString('en-IN')}</td>
                                                    <td>{item.total_sell_quantity.toLocaleString('en-IN')}</td>
                                                    <td>{item.total_trade_volume.toLocaleString('en-IN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        {selectedNavItem === 'MONEYFLOW' && (
                            <>
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
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.slice().reverse().map((item, index) => (
                                                <tr key={item?.id}>
                                                    <td className="table-cell">{item?.time}</td>
                                                    <td className="table-cell">{item?.close}</td>
                                                    <td className="table-cell">{item?.open}</td>
                                                    <td className="table-cell">{item?.high}</td>
                                                    <td className="table-cell">{item?.low}</td>
                                                    <td className="table-cell">{item?.average}</td>
                                                    <td className="table-cell">{item?.volume}</td>
                                                    <td
                                                        className={`table-cell ${selectedColors.netMoneyFlowColors[index] === 'green'
                                                                ? 'text-green-500'
                                                                : selectedColors.netMoneyFlowColors[index] === 'red'
                                                                    ? 'text-red-500'
                                                                    : ''
                                                            }`}
                                                    >
                                                        {item?.money_flow}
                                                    </td>
                                                    <td
                                                        className={`table-cell ${selectedColors.netMoneyFlowColors[index] === 'green'
                                                                ? 'text-green-500'
                                                                : selectedColors.netMoneyFlowColors[index] === 'red'
                                                                    ? 'text-red-500'
                                                                    : ''
                                                            }`}
                                                    >
                                                        {item?.net_money_flow}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="graph-cash-bottom">
                                    <MoneyFlowGraph data={data} />
                                </div>
                            </>
                        )}
                        {selectedNavItem === 'PREDICTIONS' && (
                            <>
                                <div className="table-container1">
                                    <table className="table1">
                                        <thead className="table-header">
                                            <tr>
                                                <th className="table-header-cell">Time</th>
                                                <th className="table-header-cell">Close</th>
                                                <th className="table-header-cell">Adaboost</th>
                                                <th className="table-header-cell">Xgboost</th>
                                                <th className="table-header-cell">Xgboost sma</th>
                                                <th className="table-header-cell">Lstm 10</th>
                                                <th className="table-header-cell">Lstm 10 sma</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.slice().reverse().map((item, index) => (
                                                <tr key={item?.id}>
                                                    <td className="table-cell">{item?.time}</td>
                                                    <td className="table-cell">{item?.close}</td>
                                                    <td className="table-cell">{item?.predicted_close}</td>
                                                    <td className="table-cell">{item?.predicted_xgboost_close}</td>
                                                    <td className="table-cell">{item?.predicted_xgboost_close_sma}</td>
                                                    <td className="table-cell">{item?.predicted_lstm_10_close}</td>
                                                    <td className="table-cell">{item?.predicted_lstm_10_close_sma}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
