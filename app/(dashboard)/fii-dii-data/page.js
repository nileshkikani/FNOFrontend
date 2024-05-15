'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

// ------------HOOKS----------
import useFiiDiiData from '@/hooks/useFiiDiiData';

//---------CHARTS-----------
import DailyIndexOption from '@/component/FII-DII-Graphs/DailyIndexOption-Graph';
import DailyIndexFutures from '@/component/FII-DII-Graphs/DailyIndexFutures-Graph';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

import OptionsDataGraph from '@/component/FII-DII-Graphs/OptionsData-Graph';
import FuturesDataGraph from '@/component/FII-DII-Graphs/FuturesData-Graph';
import { useAppSelector } from '@/store';

export default function Page() {
  const { checkClientType, handleFetch, isLoading } = useFiiDiiData();
  const authState = useAppSelector((state) => state.auth.authState);

  useEffect(() => {
    authState && handleFetch();
  }, []);

  return (
    <>
      <div>
        <select onChange={checkClientType}>
          <option value="FII">FII</option>
          <option value="DII">DII</option>
          <option value="Pro">Pro</option>
          <option value="Client">Client</option>
        </select>
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
    </>
  );
}
