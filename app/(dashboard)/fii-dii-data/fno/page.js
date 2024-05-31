'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useFiiDiiData from '@/hooks/useFiiDiiData';
import { useAppSelector } from '@/store';
import "../global.css"

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));
import DailyIndexOption from '@/component/FII-DII-Graphs/DailyIndexOption-Graph';
import DailyIndexFutures from '@/component/FII-DII-Graphs/DailyIndexFutures-Graph';
import OptionsDataGraph from '@/component/FII-DII-Graphs/OptionsData-Graph';
import FuturesDataGraph from '@/component/FII-DII-Graphs/FuturesData-Graph';

export default function Page() {
  const { checkClientType, handleFetch, isLoading } = useFiiDiiData();
  const authState = useAppSelector((state) => state.auth.authState);
  const [selectedClientType, setSelectedClientType] = useState('FII');

  useEffect(() => {
    authState && handleFetch();
  }, []);

  return (
    <div className='div-parent'>
      <div className="chart-div">
        <div className="radio-button-group">
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
          <div className="fii-dii-graph-div">
            <DailyIndexOption />
          </div>
          <div className="fii-dii-graph-div">
            <DailyIndexFutures />
          </div>
          <div className="fii-dii-graph-div">
            <OptionsDataGraph />
          </div>
          <div className="fii-dii-graph-div">
            <FuturesDataGraph />
          </div>
        </>
      )}
            </div>
    </div>
  );
}
