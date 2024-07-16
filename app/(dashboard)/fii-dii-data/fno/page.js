'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import moment from 'moment';
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';
import '../global.css';

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));
import DailyIndexOption from '@/component/FII-DII-Graphs/DailyIndexOption-Graph';
import DailyIndexFutures from '@/component/FII-DII-Graphs/DailyIndexFutures-Graph';
import OptionsDataGraph from '@/component/FII-DII-Graphs/OptionsData-Graph';
import FuturesDataGraph from '@/component/FII-DII-Graphs/FuturesData-Graph';

export default function Page() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authState = useAppSelector((state) => state.auth.authState);
  const [selectedClientType, setSelectedClientType] = useState('FII');
  const currentDate = new Date();
  const [monthFromDropdown, setMonthFromDropdown] = useState(currentDate.getMonth() + 1);
  const [yearFromDropdown, setYearFromDropdown] = useState(currentDate.getFullYear());
  const [filteredByClient, setFilteredByClient] = useState(null);
  const { handleResponceError } = useAuth();

  const dropdownOptions = useMemo(() => {
    const options = [];
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    for (let i = 5; i >= 0; i--) {
      let month = currentMonth - i;
      let year = currentYear;
      if (month <= 0) {
        month = 12 + month;
        year = currentYear - 1;
      }
      options.push({ year, month });
    }
    return options;
  }, [currentDate]);

  const getFiiDiiData = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = `${API_ROUTER.LIST_MARKET_DATAL}?month=${monthFromDropdown}&year=${yearFromDropdown}`;
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setData(response.data);
      const firstLoadClient = response.data.filter((itm) => itm.client_type === selectedClientType);
      setFilteredByClient(firstLoadClient);
      setIsLoading(false);
    } catch (error) {
      handleResponceError();
      // console.log('Error getting fii-dii daily data:', error);
    }
  }, [monthFromDropdown, yearFromDropdown, data]);

  useEffect(() => {
    if (authState) {
      getFiiDiiData();
    }
  }, [monthFromDropdown, yearFromDropdown]);

  const handleMonthChange = (event) => {
    const selectedValue = event.target.value;
    const [year, month] = selectedValue.split('-');
    setMonthFromDropdown(Number(month));
    setYearFromDropdown(Number(year));
  }

  const checkClientType = (e) => {
    const checkClient = e.target.value;
    const filteredClient = data?.filter((item) => item?.client_type === checkClient);
    setFilteredByClient(filteredClient);
    setSelectedClientType(checkClient);
  }

  return (
    <div className="div-parent">
      <div className="fii-dii-chart-div">
        <div className="radio-button-group client-month-flex">
          <div className="radio-button-nested">
            {['FII', 'DII', 'Pro', 'Client'].map((item) => (
              <React.Fragment key={item}>
                <input
                  type="radio"
                  id={item}
                  name="clientType"
                  value={item}
                  onChange={checkClientType}
                  checked={selectedClientType === item}
                />
                <label htmlFor={item} className={selectedClientType === item ? 'radio-button-checked' : 'radio-button'}>
                  {item}
                </label>
              </React.Fragment>
            ))}
          </div>
          <div>
            <label>
              <select className="stock-dropdown" onChange={handleMonthChange}>
                {dropdownOptions.reverse().map(({ year, month }, index) => (
                  <option key={index} value={`${year}-${month}`}>
                    {moment(`${year}-${month}`, 'YYYY-MM').format('MMMM YYYY')}
                  </option>
                ))}
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
