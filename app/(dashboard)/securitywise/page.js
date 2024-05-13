'use client';
import React, { useEffect } from 'react';
import useSecurityWiseData from '@/hooks/useSecurityWiseData';
import Link from 'next/link';

export default function Page() {
  const { setDropdownDate, data, uniqueDates, getData, showNiftyStocksOnly, stockGraph } = useSecurityWiseData();
  useEffect(() => {
    getData();
  }, []);


  return (
    <>
      <label>
        Date
        <select onChange={setDropdownDate}>
          {/* <option disabled selected value>
            select date
          </option> */}
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10px',
          marginBottom: '10px'
        }}
      >
        <div
          style={{
            borderRadius: '8px',
            backgroundColor: 'gray',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 18
          }}
        ></div>
      </div>
      <div className="scrolling-table">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Delivered Qty</th>
              <th>Avg Delivered Qty</th>
              <th>Traded Qty</th>
              <th>Avg Traded Qty</th>
              <th>Last Price</th>
              <th>% Dly Qt to Traded Qty</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id}>
                <td value={item?.symbol} style={{color:'blue',textDecoration: 'underline'}}>
                  <Link
                    href={{
                      pathname: '/securitywise/selectedsecurity/',
                      query: { symbol: item?.symbol }
                    }}
                  >
                    {item?.symbol}
                  </Link>
                </td>
                <td>
                  {Number(item?.deliverable_qty).toLocaleString('en-IN', {
                    maximumFractionDigits: 0
                  })}
                  <br />
                  <span className="green">{item?.times_delivery} x</span>
                </td>
                <td>
                  {Number(item?.average_delivery_quantity).toLocaleString('en-IN', {
                    maximumFractionDigits: 0
                  })}
                </td>
                <td>
                  {Number(item?.total_traded_quantity).toLocaleString('en-IN', {
                    maximumFractionDigits: 0
                  })}
                  <br />
                  <span className="green">{item?.times_traded} x</span>
                </td>
                <td>
                  {Number(item?.average_traded_quantity).toLocaleString('en-IN', {
                    maximumFractionDigits: 0
                  })}
                </td>
                <td>{item?.last_price}</td>
                <td>{item?.dly_qt_to_traded_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
