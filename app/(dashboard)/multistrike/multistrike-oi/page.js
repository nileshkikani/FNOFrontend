'use client';
import React, { useEffect, useState } from 'react';
import '../global.css';
import dynamic from 'next/dynamic';
// import axios from 'axios';
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';

//--------------------------CHARTS-------------------------
const MultiStrikeChart = dynamic(() => import('@/component/MultiStrikeChart/MultiStrikeChart'), { ssr: false });
const PremiumDecayChart = dynamic(() => import('@/component/PremiumDecay-Graphs/PremiumDecay'), { ssr: false });

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'), { ssr: false });

const Page = () => {
  const { handleResponceError } = useAuth();
  const authState = useAppSelector((state) => state.auth.authState);
  const expiryDropDown = useAppSelector((state) => state.user.expiries);
  const [allStrikes, setAllStrikes] = useState([]);

  // --------------------MULTISTRIKE STATES------------------
  const [selectedMsStrikePrices, setSelectedMsStrikePrices] = useState([]);
  const [multiStrikeLoading, setMultistrikeLoading] = useState(false);
  const [selectedExp, setSelectedExp] = useState(expiryDropDown[0]);
  const [msChartData, setMsChartData] = useState([]);

  // ---------------------PREMIUM DECAY STATES----------------
  const [selectedPdStrikePrices, setSelectedPdStrikePrices] = useState([]);
  const [PremiumDecayIsLoading, setPremiumdecayIsLoading] = useState(false);
  const [selectedPremDEcayExp, setSelectedPremDecayExp] = useState(expiryDropDown[0]);
  const [pdChartData, setPdChartData] = useState([]);

  // -----------TOTAL VALUES-----------------
  const [totalCallDecay, setTotalCallDecay] = useState(0);
  const [totalPutDecay, setTotalPutDecay] = useState(0);
  const [totalLast9CallDecaySum, setTotalLast9CallDecaySum] = useState(0);
  const [totalLast9PutDecaySum, setTotalLast9PutDecaySum] = useState(0);

  useEffect(() => {
    getStrikes();
  }, []);

  useEffect(() => {
    multiStrikeAPiCall();
  }, [selectedExp, selectedMsStrikePrices]);

  useEffect(() => {
    premiumDecayApiCall();
  }, [selectedPremDEcayExp, selectedPdStrikePrices]);

  // --------------------API CALL FOR STRIKES----------------
  const getStrikes = async () => {
    try {
      const response = await axiosInstance.get('strikes-list/', {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      
      const strikes = response.data?.strikes || [];
      
      const stringifiedStrikes = strikes.map(strike => String(strike));
      
      setAllStrikes(stringifiedStrikes);
      setSelectedMsStrikePrices([stringifiedStrikes[2]]);
      setSelectedPdStrikePrices(stringifiedStrikes);
      
    } catch (error) {
      handleResponceError();
    }
  };
  

  // -----------------MULTISTRIKE API CALL------------------
  const multiStrikeAPiCall = async () => {
    setMultistrikeLoading(true);
    if (!authState && checkUserIsLoggedIn) {
      return router.push('/login');
    }
    try {
      let strikeParam = '';
      if (selectedMsStrikePrices.length > 1) {
        strikeParam = selectedMsStrikePrices.join(',');
      } else if (selectedMsStrikePrices.length === 1) {
        strikeParam = selectedMsStrikePrices[0];
      }
      if (strikeParam && selectedExp) {
        const apiUrl = `${API_ROUTER.MULTI_STRIKE}?expiry=${selectedExp}&strikes=${strikeParam}`;
        const response = await axiosInstance.get(apiUrl, {
          headers: { Authorization: `Bearer ${authState.access}` }
        });
        setMsChartData(response?.data);
      }
      setMultistrikeLoading(false);
    } catch (err) {
      handleResponceError();
    }
  };

  // --------------------PREMIUM DECAY API CALL----------------
  const premiumDecayApiCall = async () => {
    setPremiumdecayIsLoading(true);
    try {
      const strikeParam = selectedPdStrikePrices.join(',');
      if (selectedPremDEcayExp && strikeParam) {
        const apiUrl = `${API_ROUTER.PREMIUM_DECAY}?expiry=${selectedPremDEcayExp}&strikes=${strikeParam}`;
        const response = await axiosInstance.get(apiUrl, {
          headers: { Authorization: `Bearer ${authState.access}` }
        });
        setPdChartData(response.data);
      }
    } catch (error) {
      handleResponceError();
    } finally {
      setPremiumdecayIsLoading(false);
    }
  };

  const refreshBtn = (param) => {
    param ? multiStrikeAPiCall() : premiumDecayApiCall();
  };


  // --------------------CHECK-UNCHECK MULTISTIRKES----------------
  const checkSelectedMsStrikePrice = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      if (!selectedMsStrikePrices.includes(value)) {
        setSelectedMsStrikePrices((prevCheckedExp) => [...prevCheckedExp, value]);
      }
    } else {
      if (selectedMsStrikePrices.includes(value)) {
        setSelectedMsStrikePrices((prevCheckedExp) => prevCheckedExp.filter((item) => item !== value));
      }
    }
  };

  // --------------------CHECK-UNCHECK PREMIUM-DECAY STRIKES----------------
  const checkSelectedPdStrikePrice = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      if (!selectedPdStrikePrices.includes(value)) {
        setSelectedPdStrikePrices((prevSelected) => [...prevSelected, value]);
      }
    } else {
      if (selectedPdStrikePrices.includes(value)) {
        setSelectedPdStrikePrices((prevSelected) => prevSelected.filter((item) => item !== value));
      }
    }
  };

  useEffect(() => {
    if (pdChartData.length) {
      calculateTotals();
    }
  }, [pdChartData]);

  const calculateTotals = () => {
    let totalCallDecay = 0;
    let totalPutDecay = 0;
    let totalLast9CallDecaySum = 0;
    let totalLast9PutDecaySum = 0;

    pdChartData.forEach(item => {
      totalCallDecay += item.total_call_decay || 0;
      totalPutDecay += item.total_put_decay || 0;
      totalLast9CallDecaySum += item.last_9_call_decay_sum || 0;
      totalLast9PutDecaySum += item.last_9_put_decay_sum || 0;
    });

    setTotalCallDecay(totalCallDecay);
    setTotalPutDecay(totalPutDecay);
    setTotalLast9CallDecaySum(totalLast9CallDecaySum);
    setTotalLast9PutDecaySum(totalLast9PutDecaySum);
  };
  
  // let totalCallDecay = 0;
  // let totalPutDecay = 0;
  // let totalLast9CallDecaySum = 0;
  // let totalLast9PutDecaySum = 0;
  
  return (
    <>
      {/* -----------MULTISTRIKE SECTION--------- */}
      <div className="checkbox-container-mulistrike">
        <div>
          <button className="refresh-button2" onClick={() => refreshBtn(true)}>
            Refresh
          </button>
        </div>
        <div>
          <label>
            Expiry:
            <select onChange={(e) => setSelectedExp(e.target.value)} value={selectedExp}>
              {expiryDropDown.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        {allStrikes.map((itm, index) => (
          <div key={index} className="checkbox-div-multistrike">
            <input
              type="checkbox"
              id={`strike${index}`}
              value={itm}
              checked={selectedMsStrikePrices.includes(String(itm))}
              onChange={(e) => checkSelectedMsStrikePrice(e)}
              className="checkboxes-itself"
            />
            <label htmlFor={`strike${index}`}>{itm}</label>
            <span className={`color-dot color-dot-${index}`}></span>
            <br />
          </div>
        ))}
      </div>
      {/* -------------MULTISTRIKE CHART--------- */}
      {multiStrikeLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px',
            minHeight: '350px'
          }}
        >
          <PropagateLoader color="#33a3e3" loading={multiStrikeLoading} size={15} />
        </div>
      ) : (
        <>
          <MultiStrikeChart msChartData={msChartData} />
        </>
      )}
      {/* --------------------PREMIUM DECAY SECTION------------ */}
      <div className="main-premium-div">
        <div className="checkbox-container-mulistrike">
          <div>
            <button className="refresh-button2" onClick={() => refreshBtn()}>
              Refresh
            </button>
          </div>
          <div>
            <label>
              Expiry:
              <select onChange={(e) => setSelectedPremDecayExp(e.target.value)} value={selectedPremDEcayExp}>
                {expiryDropDown.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            {allStrikes.map((itm, index) => (
              <div key={index} className="checkbox-div-multistrike">
                <input
                  type="checkbox"
                  id={`pd${index}`}
                  value={itm}
                  checked={selectedPdStrikePrices.includes(String(itm))}
                  onChange={(e) => checkSelectedPdStrikePrice(e)}
                  className="checkboxes-itself"
                />
                <label htmlFor={`pd${index}`}>{itm}</label>
                <span className={`color-dot color-dot-${index}`}></span>
                <br />
              </div>
            ))}
          </div>
        </div>
        {/* -------------PREMIUM DECAY TABLE--------- */}
        <div>
          {pdChartData?.length > 1 && (
                     <table className="premium-decay-table">
                     <thead>
                       <tr>
                         <th>Strike Price</th>
                         <th>Call Decay</th>
                         <th>Put Decay</th>
                         <th>Last 9 Call Decay Sum</th>
                         <th>Last 9 Put Decay Sum</th>
                       </tr>
                     </thead>
                     <tbody>
                       {pdChartData.map((item, index) => (
                         <tr key={index}>
                           <td>{item.strike_price}</td>
                           <td className={item.total_call_decay < 0 ? 'red-text' : 'green-text'}>
                             {item.total_call_decay}
                           </td>
                           <td className={item.total_put_decay < 0 ? 'red-text' : 'green-text'}>
                             {item.total_put_decay}
                           </td>
                           <td className={item.last_9_call_decay_sum < 0 ? 'red-text' : 'green-text'}>
                             {item.last_9_call_decay_sum}
                           </td>
                           <td className={item.last_9_put_decay_sum < 0 ? 'red-text' : 'green-text'}>
                             {item.last_9_put_decay_sum}
                           </td>
                         </tr>
                       ))}
                       <tr>
                         <td><strong>Total:</strong></td>
                         <td className={totalCallDecay < 0 ? 'red-text' : 'green-text'}>
                           {totalCallDecay.toFixed(2)}
                         </td>
                         <td className={totalPutDecay < 0 ? 'red-text' : 'green-text'}>
                           {totalPutDecay.toFixed(2)}
                         </td>
                         <td className={totalLast9CallDecaySum < 0 ? 'red-text' : 'green-text'}>
                           {totalLast9CallDecaySum.toFixed(2)}
                         </td>
                         <td className={totalLast9PutDecaySum < 0 ? 'red-text' : 'green-text'}>
                           {totalLast9PutDecaySum.toFixed(2)}
                         </td>
                       </tr>
                     </tbody>
                   </table>
          )}
        </div>
      </div>

      {/* -------PREMIUM DECAY CHART----------*/}
      {PremiumDecayIsLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px',
            minHeight: '350px'
          }}
        >
          <PropagateLoader color="#33a3e3" loading={PremiumDecayIsLoading} size={15} />
        </div>
      ) : (
        <>
          <PremiumDecayChart data={pdChartData} isChecked={selectedPdStrikePrices} />
        </>
      )}
    </>
  );
};

export default Page;
