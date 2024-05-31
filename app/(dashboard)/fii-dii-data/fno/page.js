'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import moment from 'moment';
// import axios from "axios";
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
// import useFiiDiiData from '@/hooks/useFiiDiiData';
import { useAppSelector } from '@/store';
import '../global.css';

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));
import DailyIndexOption from '@/component/FII-DII-Graphs/DailyIndexOption-Graph';
import DailyIndexFutures from '@/component/FII-DII-Graphs/DailyIndexFutures-Graph';
import OptionsDataGraph from '@/component/FII-DII-Graphs/OptionsData-Graph';
import FuturesDataGraph from '@/component/FII-DII-Graphs/FuturesData-Graph';

export default function Page() {
  const dropdownOptions = [];
  const currentDate = new Date();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // const { checkClientType, handleFetch, isLoading } = useFiiDiiData();
  const authState = useAppSelector((state) => state.auth.authState);
  const [selectedClientType, setSelectedClientType] = useState('FII');

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [monthFromDropdown, setMonthFromDropdown] = useState(currentMonth);
  const [yearFromDropdown, setYearFromDropdown] = useState(currentYear);
  const [filteredByClient, setfilteredByClient] = useState();

  // ----------last 6 month loop--------------
  for (let i = 5; i >= 0; i--) {
    let month = currentMonth - i;
    let year = currentYear;
    if (month <= 0) {
      month = 12 + month;
      year = currentYear - 1;
    }
    dropdownOptions.push({ year, month });
  }
  dropdownOptions.reverse();

  const getFiiDiiData = async () => {
    setIsLoading(true);
    try {
      let apiUrl = `${API_ROUTER.LIST_MARKET_DATAL}?month=${monthFromDropdown}&year=${yearFromDropdown}`;
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      // console.log('rrrs', response.data);
      setData(response.data);
      const firstLoadClient = response.data.filter((itm) => itm.client_type === selectedClientType);
      setfilteredByClient(firstLoadClient);
      setIsLoading(false);
    } catch (error) {
      console.log('error getting fii-dii daily data:', error);
    }
  };
  // console.log('rtrtr', data);
  useEffect(() => {
    authState && getFiiDiiData();
  }, [monthFromDropdown, yearFromDropdown]);

  // --------month dropdown handle------
  const handleMonthChange = (event) => {
    const selectedValue = event.target.value;
    const [year, month] = selectedValue.split('-');
    // console.log("ttt",year,"yyy",month)
    setMonthFromDropdown(month);
    setYearFromDropdown(year);
  };

  // ---------client checkbox handle------  
  const checkClientType = (e) => {
    const checkClient = e.target.value;
    const filteredClient = data.filter((item) => item?.client_type === checkClient);
    setfilteredByClient(filteredClient);
    // console.log('jjjj', filteredClient);
  };

  return (
    <div className="div-parent">
      <div className="chart-div">
        <div className="radio-button-group client-month-flex">
          <div className="radio-button-nested">
            <input
              type="radio"
              id="FII"
              name="clientType"
              value="FII"
              onChange={(e) => {
                checkClientType(e);
                setSelectedClientType('FII');
              }}
              checked={selectedClientType === 'FII'}
            />
            <label htmlFor="FII" className="radio-button">
              FII
            </label>
            <input
              type="radio"
              id="DII"
              name="clientType"
              value="DII"
              onChange={(e) => {
                checkClientType(e);
                setSelectedClientType('DII');
              }}
              checked={selectedClientType === 'DII'}
            />
            <label htmlFor="DII" className="radio-button">
              DII
            </label>

            <input
              type="radio"
              id="Pro"
              name="clientType"
              value="Pro"
              onChange={(e) => {
                checkClientType(e);
                setSelectedClientType('Pro');
              }}
              checked={selectedClientType === 'Pro'}
            />
            <label htmlFor="Pro" className="radio-button">
              Pro
            </label>

            <input
              type="radio"
              id="Client"
              name="clientType"
              value="Client"
              onChange={(e) => {
                checkClientType(e);
                setSelectedClientType('Client');
              }}
              checked={selectedClientType === 'Client'}
            />
            <label htmlFor="Client" className="radio-button">
              Client
            </label>
          </div>
          <div>
            <label>
              <select className="stock-dropdown" onChange={handleMonthChange}>
                {dropdownOptions.map((option, index) => {
                  const year = option.year;
                  const month = option.month;
                  const monthName = moment(`${year}-${month}`, 'YYYY-MM').format('MMMM');
                  return (
                    <option key={index} value={`${year}-${month}`}>
                      {`${monthName} ${year}`}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </div>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80vh'
            }}
          >
            <PropagateLoader color="#33a3e3" loading={isLoading} size={15} />
          </div>
        ) : (
          <>
            {filteredByClient && (
              <>
                <div className="fii-dii-graph-div">
                  <DailyIndexOption filteredByClient={filteredByClient} />
                </div>
                <div className="fii-dii-graph-div">
                  <DailyIndexFutures filteredByClient={filteredByClient} />
                </div>
                <div className="fii-dii-graph-div">
                  <OptionsDataGraph filteredByClient={filteredByClient} />
                </div>
                <div className="fii-dii-graph-div">
                  <FuturesDataGraph filteredByClient={filteredByClient} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
