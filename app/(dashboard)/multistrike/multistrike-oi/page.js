'use client';
import React, { useEffect, useState } from 'react';
import '../global.css';
import dynamic from 'next/dynamic';
// import axios from 'axios';
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
  const [forTableOnly,setForTableOnly] = useState({});

  //--------PREMIUM DECAY STRIKE STATES--------
  // const [strike1, setStrike1] = useState([]);
  // const [strike2, setStrike2] = useState([]);
  // const [strike3, setStrike3] = useState([]);
  // const [strike4, setStrike4] = useState([]);
  // const [strike5, setStrike5] = useState([]);

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
        // setForTableOnly(response.data)
      }
    } catch (error) {
      console.log('error calling premium decay api', error);
    }
  };

  //--------------------API CALL FOR STRIKES----------------
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

  useEffect(() => {
    getStrikes();
  }, []);

  useEffect(() => {
    multiStrikeAPiCall();
  }, [selectedExp, selectedMsStrikePrices]);

  useEffect(() => {
    premiumDecayApiCall();
  }, [selectedPremDEcayExp, selectedPdStrikePrices]);

  const refreshBtn = (param) => {
    param ? multiStrikeAPiCall() : premiumDecayApiCall();
  };

    console.log("edded",pdChartData);
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
        {/* <table>
          <thead>
            <th>strike price</th>
            <th>total call decay</th>
            <th>total put decay</th>
            <th>last 9 call decay</th>
            <th>last 9 put decay</th>
          </thead>
          {pdChartData.map((itm) => (
            <tr>
              <td>{itm.strike_price}</td>
              <td>{itm.total_call_decay}</td>
              <td>{itm.total_put_decay}</td>
              <td>{itm.last_9_call_decay_sum}</td>
              <td>{itm.last_9_put_decay_sum}</td>
            </tr>
          ))}
        </table> */}
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
