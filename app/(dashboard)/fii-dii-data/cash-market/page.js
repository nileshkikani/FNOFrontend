'use client';
import { API_ROUTER } from '@/services/apiRouter';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
// import axios from 'axios';
import moment from 'moment';
import { useAppSelector } from '@/store';
import DataTable from 'react-data-table-component';
import { XAxis, ComposedChart, ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import '../global.css';

const Page = () => {
  const dropdownOptions = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [data, setData] = useState([]);
  const authState = useAppSelector((state) => state.auth.authState);

  const [reversedFilteredData, setReversedFilteredData] = useState([]);
  const [monthFromDropdown, setMonthFromDropdown] = useState(currentMonth);
  const [yearFromDropdown, setYearFromDropdown] = useState(currentYear);

  const column = [
    {
      name: <span className="table-heading-text">{'Date'}</span>,
      selector: (row) => {
        const milliseconds = row.date;
        const date = new Date(milliseconds);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day} ${month}`;
      },
      sortable: true
      // sortFunction: customSort
    },
    {
      name: <span className="table-heading-text">{'FII Cash Buy'}</span>,
      selector: (row) => +row.fii_buy,
      format: (row) => (
        <span className="">
          ₹{(+row.fii_buy).toLocaleString('en-IN')}
          {' Cr'}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'FII Cash Sell'}</span>,
      selector: (row) => +row.fii_sell,
      format: (row) => (
        <span className="">
          ₹{(+row.fii_sell).toLocaleString('en-IN')}
          {' Cr'}
        </span>
      ),

      sortable: true
    },
    {
      name: <span className="table-heading-text">{'FII Cash Net'}</span>,
      selector: (row) => +row.fii_net,
      format: (row) => (
        <span className={+row.fii_net < 0 ? 'red-text' : 'green-text'}>
          {+row.fii_net >= 0 ? '+₹ ' : '-₹ '}
          {Math.abs(+row.fii_net).toLocaleString('en-IN')}
          {' Cr'}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'DII Cash Buy'}</span>,
      selector: (row) => +row.dii_buy,
      format: (row) => (
        <span className="">
          ₹ {(+row.dii_buy).toLocaleString('en-IN')}
          {' Cr'}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'DII Cash Sell'}</span>,
      selector: (row) => +row.dii_sell,
      format: (row) => (
        <span className="">
          ₹ {(+row.dii_sell).toLocaleString('en-IN')}
          {' Cr'}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'DII Cash Net'}</span>,
      selector: (row) => +row.dii_net,
      format: (row) => (
        <span className={+row.dii_net < 0 ? 'red-text' : 'green-text'}>
          {+row.dii_net >= 0 ? '+₹ ' : '-₹ '}
          {Math.abs(+row.dii_net).toLocaleString('en-IN')}
          {' Cr'}
        </span>
      ),
      sortable: true
    }
  ];

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

  const getDailyFiiDiiData = async () => {
    try {
      let apiUrl = `${API_ROUTER.DAILY_FII_DII_DATA}?month=${monthFromDropdown}&year=${yearFromDropdown}`;
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      // console.log('rrrs', response.data);
      setData(response.data);
    } catch (error) {
      console.log('error getting fii-dii daily data:', error);
    }
  };

  // -------dropdown handler--------
  const handleMonthChange = (event) => {
    const selectedValue = event.target.value;
    const [year, month] = selectedValue.split('-');
    setMonthFromDropdown(month);
    setYearFromDropdown(year);
  };

  let maxFiiNet = Math.max(...data.map((item) => item.fii_net));
  let maxDiiNet = Math.max(...data.map((item) => item.dii_net));

  let minFiiNet = Math.min(...data.map((item) => item.fii_net));
  let minDiiNet = Math.min(...data.map((item) => item.dii_net));

  let startRange = 0;
  let endRange = 0;

  if (maxFiiNet >= maxDiiNet) {
    endRange = maxFiiNet + 100;
  } else {
    endRange = maxDiiNet + 100;
  }
  if (minFiiNet <= minDiiNet) {
    startRange = minFiiNet - 100;
  } else {
    startRange = minDiiNet - 100;
  }

  useEffect(() => {
    if (dropdownOptions.length > 0) {
      getDailyFiiDiiData();
    }
  }, [monthFromDropdown, yearFromDropdown]);

  // -------REVERSING DATA FOR DATATABLE ONLY--------
  useEffect(() => {
    const reversedData = [...data].reverse();
    setReversedFilteredData(reversedData);
  }, [data]);

  return (
    <div className="div-parent">
      {/* ---------chart----------- */}
      <div style={{ width: '100%', height: '500px' }} className="fii-dii-chart-div">
        <div className='cash-market-dd'>
          <h1 className="table-title">Cash Market Activity - Long Term View</h1>
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
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
            style={{ backgroundColor: 'white' }}
          >
            <CartesianGrid stroke="#E5E5E5" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => {
                const date = new Date(dateStr);
                const day = date.getDate();
                const month = date.toLocaleString('default', { month: 'short' });
                return `${day} ${month}`;
              }}
            />

            {/* <YAxis yAxisId="left" /> */}
            <YAxis domain={[startRange, endRange]} />
            <Tooltip
              labelFormatter={(timeStr) =>
                new Date(timeStr).toLocaleTimeString([], {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            />
            <Legend />
            <Bar
              // yAxisId="left"
              name="FII"
              // type="monotone"
              dataKey="fii_net"
              fill="#33a3e3"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Bar
              // yAxisId="right"
              name="DII"
              // type="linear"
              dataKey="dii_net"
              fill="#6c6290"
             
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* -------------data table-------- */}
      <div className="table-div">
        <h1 className="table-title">Cash Market Daily Summary</h1>
        <div className="data-table">
          <DataTable
            columns={column}
            data={reversedFilteredData}
            pagination={true}
            paginationPerPage={12}
            paginationRowsPerPageOptions={[12]}
            customStyles={{
              rows: {
                style: {
                  '&:nth-child(even)': {
                    backgroundColor: '#f9f9f9'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
