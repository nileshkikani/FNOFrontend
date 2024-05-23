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

  const column = [
    {
      name: <span className="table-heading-text">{'Date'}</span>,
      selector: (row) => {
        const milliseconds = row.date;
        const date = new Date(milliseconds);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return formattedDate;
      },

      sortable: true
    },
    {
      name: <span className="table-heading-text">{'FII Cash Buy'}</span>,
      selector: (row) => +row.fii_buy,
      format: (row) => <span className="">₹{(+row.fii_buy).toLocaleString('en-IN')}</span>,

      sortable: true
    },
    {
      name: <span className="table-heading-text">{'FII Cash Sell'}</span>,
      selector: (row) => +row.fii_sell,
      format: (row) => <span className="">₹{(+row.fii_sell).toLocaleString('en-IN')}</span>,

      sortable: true
    },
    {
      name: <span className="table-heading-text">{'FII Cash Net'}</span>,
      selector: (row) => +row.fii_net,
      format: (row) => (
        <span className={+row.fii_net < 0 ? 'red-text' : 'green-text'}>
          {+row.fii_net >= 0 ? '+₹' : '-₹'}
          {Math.abs(+row.fii_net).toLocaleString('en-IN')}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'DII Cash Buy'}</span>,
      selector: (row) => +row.dii_buy,
      format: (row) => <span className="">₹{(+row.dii_buy).toLocaleString('en-IN')}</span>,
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'DII Cash Sell'}</span>,
      selector: (row) => +row.dii_sell,
      format: (row) => <span className="">₹{(+row.dii_sell).toLocaleString('en-IN')}</span>,
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'DII Cash Net'}</span>,
      selector: (row) => +row.dii_net,
      format: (row) => (
        <span className={+row.dii_net < 0 ? 'red-text' : 'green-text'}>
          {+row.dii_net >= 0 ? '+₹' : '-₹'}
          {Math.abs(+row.dii_net).toLocaleString('en-IN')}
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
    } catch (error) {
      console.log('error getting fii-dii daily data:', err);
    }
  };

  useEffect(() => {
    getDailyFiiDiiData();
  }, []);
  console.log('uuu', data);
  return (
    <div className="div-parent">
      {/* ---------chart----------- */}
      <div style={{ width: '100%', height: '500px' }} className="chart-div">
        <h1 className="table-title">Cash Market Activity - Long Term View</h1>
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
              tickFormatter={(timeStr) =>
                new Date(timeStr).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            />
            <YAxis yAxisId="left" />
            <YAxis
              yAxisId="right"
              orientation="right"
              // domain={[adjustedNiftyStart, adjustedNiftyEnd]}
              hide
            />
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
              yAxisId="left"
              name="FII"
              // type="monotone"
              dataKey="fii_net"
              fill="#6c6290"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Bar
              yAxisId="right"
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
            data={data}
            pagination={true}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10]}
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
