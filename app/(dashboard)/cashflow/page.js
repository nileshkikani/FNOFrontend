'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import './global.css';

//--------HOOKS---------------
// import useCashflowData from '@/hooks/useCashflowData';

//-----GRAPH COMPONENTS----------
const MoneyFlowGraph = dynamic(() => import('@/component/MoneyFlow-Graphs/MoneyFlow-Graph'));
import { useAppSelector } from '@/store';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import ActiveMoneyFlow from '@/component/MoneyFlow-Graphs/ActiveMoneyFlow-Graph';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

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
      let apiUrl = `${API_ROUTER.CASH_FLOW_TOP_TEN}`;

      const response = await axiosInstance.get(
        selectedDate && selectedScript ? (apiUrl += `?date=${selectedDate}&symbol=${selectedScript}`) : apiUrl,
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
        setSelectedColors({ moneyFlowColors: selectedColorForMoneyFlow.reverse(), netMoneyFlowColors: selectedColorForNetMoneyFlow.reverse() });
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
      let apiUrl = `${API_ROUTER.CASH_FLOW_ALL}`;

      const response = await axiosInstance.get((apiUrl += `?date=${selectedDate}`), {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
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
  useEffect(() => {
    authState && getData();
  }, []);

  useEffect(() => {
    if (selectedScript) {
      getData();
      // getAllStocks();
    }
  }, [selectedScript]);

  useEffect(() => {
    if (selectedDate) {
      getData();
      getAllStocks();
    }
  }, [selectedDate]);

  const refreshData = () => {
    getData();
    getAllStocks();
  };
  const filterByStockAndDate = (event, isDateDropdown) => {
    isDateDropdown ? setSelectedDate(event.target.value) : setSelectedScript(event.target.value);
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
              {allData?.stock_data && <ActiveMoneyFlow title={'Stock'} data={allData?.stock_data} />}
            </div>
            <div className="graph-div-cashFlow">
              {allData?.fno_data && <ActiveMoneyFlow title={'FNO'} data={allData?.fno_data} />}
            </div>
          </div>
        )}
        <div className="flex-container">
          <div className="dropdown-container">
            <h1 className="table-title1">SELECT DATE :</h1>
            <select
              onChange={(e) => filterByStockAndDate(e, true)}
              value={selectedDate ? selectedDate : ''}
              className="stock-dropdown"
            >
              {allDates &&
                allDates.map((stockData, index) => (
                  <option key={index} value={stockData}>
                    {stockData}
                  </option>
                ))}
            </select>
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
        {loading ? (
          <div className="loading-container">
            <PropagateLoader color="#33a3e3" loading={loading} size={15} />
          </div>
        ) : (
          <>
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
                                className={`table-cell ${
                                  selectedColors.netMoneyFlowColors[index] == 'green'
                                    ? 'text-green-500'
                                    : selectedColors.netMoneyFlowColors[index] == 'red'
                                    ? 'text-red-500'
                                    : ''
                                }`}
                              >
                                {item?.money_flow}
                              </td>
                              <td
                                className={`table-cell ${
                                  selectedColors.netMoneyFlowColors[index] == 'green'
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
      </div>
    </>
  );
};

export default Page;
