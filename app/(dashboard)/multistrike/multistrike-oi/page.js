'use client';
import React, { useEffect, useState } from 'react';
import '../global.css';
import dynamic from 'next/dynamic';
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';

//--------------------------CHARTS-------------------------
const MultiStrikeChart = dynamic(() => import('@/component/MultiStrikeChart/MultiStrikeChart'), { ssr: false });
const PremiumDecayChart = dynamic(() => import('@/component/PremiumDecay-Graphs/PremiumDecay'), { ssr: false });

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'), { ssr: false });

const Page = () => {
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
      setAllStrikes(response.data?.strikes);
      setSelectedMsStrikePrices([String(response.data?.strikes[2])]);
      setSelectedPdStrikePrices([String(response.data?.strikes[2])]);
    } catch (error) {
      console.log('error calling strikes api', error);
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
      console.log('error calling Multistrike', err);
      handleResponceError();
    }
  };

  // --------------------PREMIUM DECAY API CALL----------------
  const premiumDecayApiCall = async () => {
    setPremiumdecayIsLoading(true);
    try {
      let strikeParam = '';
      if (selectedPdStrikePrices.length > 1) {
        strikeParam = selectedPdStrikePrices.join(',');
      } else if (selectedPdStrikePrices.length === 1) {
        strikeParam = selectedPdStrikePrices[0];
      }
      if (strikeParam && selectedPremDEcayExp) {
        let apiUrl = `${API_ROUTER.PREMIUM_DECAY}?expiry=${selectedPremDEcayExp}&strikes=${strikeParam}`;
        const response = await axiosInstance.get(apiUrl, {
          headers: { Authorization: `Bearer ${authState.access}` }
        });
        setPdChartData(response.data);
        setPremiumdecayIsLoading(false);
      }
    } catch (error) {
      console.log('error calling premium decay api', error);
    }
  };

  const refreshBtn = (param) => {
    param ? multiStrikeAPiCall() : premiumDecayApiCall();
  };

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

  const checkSelectedPdStrikePrice = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      if (!selectedPdStrikePrices.includes(value)) {
        setSelectedPdStrikePrices((prevCheckedExp) => [...prevCheckedExp, value]);
      }
    } else {
      if (selectedPdStrikePrices.includes(value)) {
        setSelectedPdStrikePrices((prevCheckedExp) => prevCheckedExp.filter((item) => item !== value));
      }
    }
  };

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
            <table>
              <thead>
                <tr>
                  <th>strike price</th>
                  <th>total call decay</th>
                  <th>total put decay</th>
                  <th>last 9 call decay</th>
                  <th>last 9 put decay</th>
                </tr>
              </thead>
              <tbody>
                {pdChartData.slice(1).map((itm,index) => (
                  <tr key={index}>
                    <td>{itm.strike_price}</td>
                    <td className={itm.total_call_decay < 0 ? 'red-text' : 'green-text'}>{itm.total_call_decay}</td>
                    <td className={itm.total_put_decay < 0 ? 'red-text' : 'green-text'}>{itm.total_put_decay}</td>
                    <td className={itm.last_9_call_decay_sum < 0 ? 'red-text' : 'green-text'}>
                      {itm.last_9_call_decay_sum}
                    </td>
                    <td className={itm.last_9_put_decay_sum < 0 ? 'red-text' : 'green-text'}>
                      {itm.last_9_put_decay_sum}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {pdChartData?.length === 0 && <p>Loading data...</p>}
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
          <PremiumDecayChart data={pdChartData} />
        </>
      )}
    </>
  );
};

export default Page;
