'use client';
import React, { useEffect, useState } from 'react';
import useSecurityWiseData from '@/hooks/useSecurityWiseData';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DataTable from 'react-data-table-component';
import '../securitywise/global.css';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  const { setDropdownDate, data, uniqueDates, getData, showNiftyStocksOnly, isLoading, currentSelectedDate } =
    useSecurityWiseData();

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
        <Link
          href={{
            pathname: '/securitywise/selectedsecurity/',
            query: { symbol: row?.symbol }
          }}
          className="symbol-list secwise-cols"
        >
          {row?.symbol}
        </Link>
      ),
      format: (row) => <span className="secwise-cols">{+row.symbol}</span>,
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
