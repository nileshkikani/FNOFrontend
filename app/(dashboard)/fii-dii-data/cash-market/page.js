'use client';
import { API_ROUTER } from '@/services/apiRouter';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import { useAppSelector } from '@/store';
import DataTable from 'react-data-table-component';
import { XAxis, ComposedChart, ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import '../global.css';

const Page = () => {
  const [data, setData] = useState([]);
  const authState = useAppSelector((state) => state.auth.authState);
  const [allMonths, setAllMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

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

  const getDailyFiiDiiData = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTER.DAILY_FII_DII_DATA, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      console.log('rrrs', response.data);
      setData(response.data);

      const uniqueMonthsSet = new Set();
      response.data.forEach((item) => {
        const date = item.date.substring(0, 7);
        uniqueMonthsSet.add(date);
      });

      const uniqueMonthsArray = Array.from(uniqueMonthsSet);

      setAllMonths(uniqueMonthsArray);
      if (uniqueMonthsArray.length > 0) {
        setSelectedMonth(uniqueMonthsArray[0]);
      }
    } catch (error) {
      console.log('error getting fii-dii daily data:', error);
    }
  };
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filteredData = selectedMonth ? data.filter((item) => item.date.startsWith(selectedMonth)) : data;
  let maxFiiNet = Math.max(...filteredData.map((item) => item.fii_net));
  let maxDiiNet = Math.max(...filteredData.map((item) => item.dii_net));

  let minFiiNet = Math.min(...filteredData.map((item) => item.fii_net));
  let minDiiNet = Math.min(...filteredData.map((item) => item.dii_net));

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
    getDailyFiiDiiData();
  }, []);

  return (
    <div className="div-parent">
      {/* ---------chart----------- */}
      <div style={{ width: '100%', height: '500px' }} className="chart-div">
        <h1 className="table-title">Cash Market Activity - Long Term View</h1>
        <label>
          Select Month :
          <select className="stock-dropdown" value={selectedMonth} onChange={handleMonthChange}>
            {allMonths &&
              allMonths.map((date) => {
                const [year, month] = date.split('-');
                const monthName = new Date(`${year}-${month}-01`).toLocaleString('en-US', { month: 'long' });
                return (
                  <option key={date} value={date}>
                    {`${monthName} ${year}`}
                  </option>
                );
              })}
          </select>
        </label>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={400}
            data={filteredData}
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
              fill="#6c6290"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Bar
              // yAxisId="right"
              name="DII"
              // type="linear"
              dataKey="dii_net"
              fill="#33a3e3"
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
            data={filteredData}
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
