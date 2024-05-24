'use client';
import React, { useEffect, useState } from 'react';
import useSecurityWiseData from '@/hooks/useSecurityWiseData';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DataTable from 'react-data-table-component';
import '../securitywise/global.css';
import DeliveryChart from '@/component/SecurityWise/DeliveryChart';
import { useRouter } from 'next/navigation';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

const chartData = {
  dates: [
    '01-Apr',
    '02-Apr',
    '03-Apr',
    '04-Apr',
    '05-Apr',
    '08-Apr',
    '09-Apr',
    '10-Apr',
    '11-Apr',
    '12-Apr',
    '15-Apr',
    '16-Apr',
    '17-Apr',
    '18-Apr',
    '19-Apr',
    '22-Apr',
    '23-Apr',
    '24-Apr',
    '25-Apr',
    '26-Apr',
    '29-Apr',
    '30-Apr',
    '02-May',
    '03-May',
    '06-May',
    '07-May',
    '08-May',
    '09-May',
    '10-May',
    '13-May',
    '14-May',
    '15-May'
  ],
  tradedVolume: [
    100000, 90000, 85000, 120000, 110000, 130000, 125000, 115000, 90000, 95000, 105000, 115000, 100000, 90000, 85000,
    120000, 110000, 130000, 125000, 115000, 90000, 95000, 105000, 115000, 100000, 90000, 85000, 120000, 110000, 130000,
    125000, 115000
  ],
  deliveryVolume: [
    70000, 60000, 55000, 80000, 75000, 85000, 80000, 70000, 60000, 65000, 70000, 80000, 70000, 60000, 55000, 80000,
    75000, 85000, 80000, 70000, 60000, 65000, 70000, 80000, 70000, 60000, 55000, 80000, 75000, 85000, 80000, 70000
  ],
  deliveryVolumePercentage: [
    70, 66.67, 64.71, 66.67, 68.18, 65.38, 64, 60.87, 66.67, 68.42, 66.67, 69.57, 70, 66.67, 64.71, 66.67, 68.18, 65.38,
    64, 60.87, 66.67, 68.42, 66.67, 69.57, 70, 66.67, 64.71, 66.67, 68.18, 65.38, 64, 60.87
  ]
};

export default function Page() {
  const { setDropdownDate, data, uniqueDates, getData, showNiftyStocksOnly, isLoading, currentSelectedDate } =
    useSecurityWiseData();
  const route = useRouter();
  const [isFilterData, setIsFilterData] = useState(false);
  const [securityData, setSecurityData] = useState([]);

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    setData(data);
  }, [data]);

  const setData = async (data) => {
    const dataset = (await Promise.resolve(data)).sort((a, b) => b.times_delivery - a.times_delivery);
    console.log('dataset', dataset);
    setSecurityData(dataset);
    setIsFilterData(true);
  };

  const routerRedirect = (aPath) => {
    route.push(`/securitywise/${aPath}/`);
  };

  const loadingAnimation = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}
    >
      <PropagateLoader color="#33a3e3" loading={true} size={15} />
    </div>
  );

  const column = [
    {
      name: <span className="table-heading-text">Symbol</span>,
      selector: (row) => row.symbol,
      cell: (row) => (
        <span onClick={() => routerRedirect(row?.symbol)} className="link">
          {row?.symbol}
        </span>
      ),
      format: (row) => <span className="secwise-cols">{+row.symbol}</span>
      // sortable: true
    },
    {
      name: <span className="table-heading-text">{'Delivered Qty'}</span>,
      selector: (row) => +row.times_delivery,
      format: (row) => (
        <span className="secwise-cols">
          {(+row.deliverable_qty).toLocaleString('en-IN')} <br /> <span className="green">{row.times_delivery}x</span>
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Avg Delivered Qty'}</span>,
      selector: (row) => +row.average_delivery_quantity,
      format: (row) => <span className="secwise-cols">{(+row.average_delivery_quantity).toLocaleString('en-IN')}</span>,
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Traded Qty'}</span>,
      selector: (row) => +row.times_traded,
      format: (row) => (
        <span>
          <span className="secwise-cols">{(+row.total_traded_quantity).toLocaleString('en-IN')}</span> <br />
          <span className="green">{row.times_traded}x</span>
        </span>
      ),

      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Avg Traded Qty'}</span>,
      selector: (row) => +row.average_traded_quantity,
      format: (row) => <span className="secwise-cols">{(+row.average_traded_quantity).toLocaleString('en-IN')}</span>,
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Last Price'}</span>,
      selector: (row) => +row.last_price,
      format: (row) => {
        const value = ((row?.last_price - row?.prev_close) / row?.prev_close) * 100;
        return (
          <div className="column-div">
            <span className="secwise-cols">{(+row.last_price).toLocaleString('en-IN')}</span>
            <div className="row-div">
              <div className={value > 0 ? 'triangle-green-div' : 'triangle-red-div'} />
              <span className={value < 0 ? 'column-red-text' : 'column-green-text'}>{`${Math.abs(value).toFixed(
                2
              )}%`}</span>
            </div>
          </div>
        );
      },
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'% Dly Qt to Traded Qty'}</span>,
      selector: (row) => +row.dly_qt_to_traded_qty,
      format: (row) => {
        // const
        return <span className="secwise-cols">{(+row.dly_qt_to_traded_qty).toLocaleString('en-IN')}</span>;
      },
      sortable: true
    }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        overflow: 'hidden'
      }}
      className="div-main"
    >
      <div style={{ display: isLoading ? 'block' : 'none' }}>{loadingAnimation}</div>
      <div style={{ display: !isLoading && !isFilterData && !securityData ? 'block' : 'none' }}>{loadingAnimation}</div>
      <div style={{ display: !isLoading && isFilterData && securityData ? 'block' : 'none' }}>
        <div className="main-label-div">
          <div className="half-width">
            <label>
              {/* Date */}
              <select className="date-picker-modal" onChange={setDropdownDate} value={currentSelectedDate}>
                {uniqueDates?.map((itm, index) => (
                  <option key={index} value={itm}>
                    {itm}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="half-last-width">
            <label>
              <input
                type="checkbox"
                className='className="checkbox-label"'
                onChange={(event) => showNiftyStocksOnly(event.target.checked)}
              />
              <span className="checkbox-text">NIFTY STOCKS</span>
            </label>
          </div>
        </div>
        <div className="">
          <h1>Delivery Volume Chart</h1>
          <DeliveryChart data={chartData} />
        </div>
        <div className="scrolling-table">
          <DataTable
            columns={column}
            data={securityData}
            noDataComponent={
              <div style={{ textAlign: 'center' }}>
                <PropagateLoader />
              </div>
            }
            fixedHeader={{ top: true }}
          />
        </div>
      </div>
    </div>
  );
}
