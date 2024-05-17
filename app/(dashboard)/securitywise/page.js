'use client';
import React, { useEffect } from 'react';
import useSecurityWiseData from '@/hooks/useSecurityWiseData';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DataTable from 'react-data-table-component';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  const { setDropdownDate, data, uniqueDates, getData, showNiftyStocksOnly, isLoading, currentSelectedDate } =
    useSecurityWiseData();
  useEffect(() => {
    getData();
  }, []);

  const column = [
    {
      name: 'Symbol',
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
      sortable: true
    },
    {
      name: 'Delivered Qty',
      selector: (row) => +row.times_delivery,
      format: (row) => (
        <span className="secwise-cols">
          {(+row.deliverable_qty).toLocaleString('en-IN')} <br /> <span className="green">{row.times_delivery}x</span>
        </span>
      ),
      sortable: true
    },
    {
      name: 'Avg Delivered Qty',
      selector: (row) => +row.average_delivery_quantity,
      format: (row) => <span className="secwise-cols">{(+row.average_delivery_quantity).toLocaleString('en-IN')}</span>,
      sortable: true
    },
    {
      name: 'Traded Qty',
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
      name: 'Avg Traded Qty',
      selector: (row) => +row.average_traded_quantity,
      format: (row) => <span className="secwise-cols">{(+row.average_traded_quantity).toLocaleString('en-IN')}</span>,
      sortable: true
    },
    {
      name: 'Last Price',
      selector: (row) => +row.last_price,
      format: (row) => <span className="secwise-cols">{(+row.last_price).toLocaleString('en-IN')}</span>,
      sortable: true
    },
    {
      name: '% Dly Qt to Traded Qty',
      selector: (row) => +row.dly_qt_to_traded_qty,
      format: (row) => <span className="secwise-cols">{(+row.dly_qt_to_traded_qty).toLocaleString('en-IN')}</span>,
      sortable: true
    }
  ];

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

  return (
    <>
      <div style={{ display: isLoading ? 'block' : 'none' }}>{loadingAnimation}</div>
      <div style={{ display: !isLoading && !data ? 'block' : 'none' }}>{loadingAnimation}</div>
      <div style={{ display: !isLoading && data ? 'block' : 'none' }}>
        <label>
          Date
          <select onChange={setDropdownDate} value={currentSelectedDate}>
            {uniqueDates?.map((itm, index) => (
              <option key={index} value={itm}>
                {itm}
              </option>
            ))}
          </select>
        </label>
        <label>
          NIFTY STOCKS
          <input type="checkbox" onChange={(event) => showNiftyStocksOnly(event.target.checked)} />
        </label>
        <div className="scrolling-table">
          <DataTable columns={column} data={data}  noDataComponent={<div style={{ textAlign: 'center' }}><PropagateLoader/></div>} />
        </div>
      </div>
    </>
  );
}
