'use client';
import React, { useEffect, useState } from 'react';
import './global.css';
import dynamic from 'next/dynamic';
// import axios from 'axios';
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';

//---------CHARTS-----------
import MultiStrikeChart from '@/component/MultiStrikeChart/MultiStrikeChart';
import useMultiStrikeData from '@/hooks/useMultiStrikeData';
import PremiumDecayChart from '@/component/PremiumDecay-Graphs/PremiumDecay';

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

const Page = () => {
  const { strikes, checkSelectedStrike, multiStrikeAPiCall, selectedStrikePrices, multiIsLoading, selectedExp,setSelectedExp } =
    useMultiStrikeData();
  const authState = useAppSelector((state) => state.auth.authState);
  const [selectedPremiumDecay, setSelectedPremiumDecay] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const expiryDropDown = useAppSelector((state) => state.user.expiries);
  const [selectedPremDEcayExp,setSelectedPremDecayExp] = useState(expiryDropDown[0]);


  const [allPremiumDecayStrikes, setAllPremiumDecayStrikes] = useState([]);

  //--------PREMIUM DECAY STRIKE STATES--------
  const [strike1, setStrike1] = useState([]);
  const [strike2, setStrike2] = useState([]);
  const [strike3, setStrike3] = useState([]);
  const [strike4, setStrike4] = useState([]);
  const [strike5, setStrike5] = useState([]);

  // ---------PREMIUM DECAY API CALL-----------
  const premiumDecayApiCall = async () => {
    setIsLoading(true);
    try {
      let apiUrl = `${API_ROUTER.PREMIUM_DECAY}?expiry=${selectedPremDEcayExp}`;
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      // setDecayValue(response.data.data);
      setAllPremiumDecayStrikes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('error calling premium decay api', error);
    }
  };

  // console.log('erree', allPremiumDecayStrikes);

  const checkPremiumDecayStrike = (e, identifier) => {
    // console.log('event is working');
    if (e.target.checked) {
      !selectedPremiumDecay.includes(+e.target.value) &&
        setSelectedPremiumDecay([...selectedPremiumDecay, +e.target.value]);
    } else {
      setSelectedPremiumDecay(selectedPremiumDecay.filter((aItem) => +aItem != +e.target.value));
    }

    switch (identifier) {
      case 1:
        if (e.target.checked) {
          const filteredStrikeData1 = allPremiumDecayStrikes.filter((itm) => itm.strike_price == e.target.value);
          setStrike1(filteredStrikeData1[0]?.data);
          return;
        }
        setStrike1([]);
        break;
      case 2:
        if (e.target.checked) {
          const filteredStrikeData2 = allPremiumDecayStrikes.filter((itm) => itm.strike_price == e.target.value);
          setStrike2(filteredStrikeData2[0]?.data);
          return;
        }
        setStrike2([]);
        break;
      case 3:
        if (e.target.checked) {
          const filteredStrikeData3 = allPremiumDecayStrikes.filter((itm) => itm.strike_price == e.target.value);
          setStrike3(filteredStrikeData3[0]?.data);
          return;
        }
        setStrike3([]);
        break;
      case 4:
        if (e.target.checked) {
          const filteredStrikeData4 = allPremiumDecayStrikes.filter((itm) => itm.strike_price == e.target.value);
          setStrike4(filteredStrikeData4[0]?.data);
          return;
        }
        setStrike4([]);
        break;
      case 5:
        if (e.target.checked) {
          const filteredStrikeData5 = allPremiumDecayStrikes.filter((itm) => itm.strike_price == e.target.value);
          setStrike5(filteredStrikeData5[0]?.data);
          return;
        }
        setStrike5([]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (strikes.length > 0) {
      checkSelectedStrike({ target: { value: strikes[2], checked: true } }, 3);
    }
  }, [strikes]);

  useEffect(() => {
    multiStrikeAPiCall();
  }, [selectedExp]);

  useEffect(()=>{
    premiumDecayApiCall();
  },[selectedPremDEcayExp])

  useEffect(() => {
    if (allPremiumDecayStrikes.length > 0) {
      checkPremiumDecayStrike({ target: { value: allPremiumDecayStrikes[3].strike_price, checked: true } }, 3);
    }
  }, [allPremiumDecayStrikes]);

  const refreshBtn = (param) => {
    param ? multiStrikeAPiCall() : premiumDecayApiCall();
  };

  return (
    <>
      {/* -----------MULTISTRIKE SECTION--------- */}
      {/* {multiIsLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px'
          }}
        >
          <PropagateLoader color="#33a3e3" loading={multiIsLoading} size={15} />
        </div>
      ) : (
        <> */}
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
        {strikes.map((itm, index) => (
          <div key={index} className="checkbox-div-multistrike">
            <input
              type="checkbox"
              id={`strike${index}`}
              value={itm}
              checked={selectedStrikePrices.includes(itm)}
              onChange={(e) => checkSelectedStrike(e, index + 1)}
              className="checkboxes-itself"
            />
            <label htmlFor={`strike${index}`}>{itm}</label>
            <span className={`color-dot color-dot-${index}`}></span>
            <br />
          </div>
        ))}
      </div>
      {/* -------MULTISTRIKE CHART--------- */}
      {multiIsLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px',
            minHeight: '350px'
          }}
        >
          <PropagateLoader color="#33a3e3" loading={multiIsLoading} size={15} />
        </div>
      ) : (
        <>
          <MultiStrikeChart />
        </>
      )}
      {!isLoading && (
        <div className="decay-main-div">
          <div className="table-container-premium">
            <table>
              <thead>
                <tr>
                  <th>Strikes</th>
                  <th>Last 45 min call decay</th>
                  <th>Last 45 min put decay</th>
                  <th>Total call decay</th>
                  <th>Total put decay</th>
                </tr>
              </thead>
              <tbody>
                {allPremiumDecayStrikes?.slice(1).map((itm, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        id={`decay${index}`}
                        value={itm.strike_price}
                        checked={selectedPremiumDecay.includes(itm.strike_price)}
                        onChange={(e) => checkPremiumDecayStrike(e, index + 1)}
                        className="checkboxes-itself"
                      />
                      <label htmlFor={`decay${index}`}>{itm.strike_price}</label>
                      <span className={`color-dot color-dot-${index}`}></span>
                    </td>
                    <td>
                      <span className={itm.last_9_call_decay_sum < 0 ? 'last45mindecay-red' : 'last45mindecay-green'}>
                        {itm.last_9_call_decay_sum}
                      </span>
                    </td>
                    <td>
                      <span className={itm.last_9_put_decay_sum < 0 ? 'last45mindecay-red' : 'last45mindecay-green'}>
                        {itm.last_9_put_decay_sum}
                      </span>
                    </td>
                    <td>
                      <span className={itm.total_call_decay < 0 ? 'last45mindecay-red' : 'last45mindecay-green'}>
                        {itm.total_call_decay}
                      </span>
                    </td>
                    <td>
                      <span className={itm.total_put_decay < 0 ? 'last45mindecay-red' : 'last45mindecay-green'}>
                        {itm.total_put_decay}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan="3">Total decay</td>
                  <td
                    className={` ${
                      parseFloat(
                        allPremiumDecayStrikes.reduce((acc, itm) => {
                          if (!isNaN(itm.total_call_decay)) {
                            return acc + itm.total_call_decay;
                          } else {
                            return acc;
                          }
                        }, 0)
                      ).toFixed(2) < 0
                        ? 'last45mindecay-red'
                        : 'last45mindecay-green'
                    }`}
                  >
                    <span>
                      {
                        parseFloat(
                          allPremiumDecayStrikes.reduce((acc, itm) => {
                            if (!isNaN(itm.total_call_decay)) {
                              return acc + itm.total_call_decay;
                            } else {
                              return acc;
                            }
                          }, 0)
                        )
                          .toFixed(2)
                          .split('.')[0]
                      }
                    </span>
                    <span>.</span>
                    <span>
                      {
                        parseFloat(
                          allPremiumDecayStrikes.reduce((acc, itm) => {
                            if (!isNaN(itm.total_call_decay)) {
                              return acc + itm.total_call_decay;
                            } else {
                              return acc;
                            }
                          }, 0)
                        )
                          .toFixed(2)
                          .split('.')[1]
                      }
                    </span>
                  </td>
                  <td
                    className={`${
                      parseFloat(
                        allPremiumDecayStrikes.reduce((acc, itm) => {
                          if (!isNaN(itm.total_put_decay)) {
                            return acc + itm.total_put_decay;
                          } else {
                            return acc;
                          }
                        }, 0)
                      ).toFixed(2) < 0
                        ? 'last45mindecay-red'
                        : 'last45mindecay-green'
                    }`}
                  >
                    <span>
                      {
                        parseFloat(
                          allPremiumDecayStrikes.reduce((acc, itm) => {
                            if (!isNaN(itm.total_put_decay)) {
                              return acc + itm.total_put_decay;
                            } else {
                              return acc;
                            }
                          }, 0)
                        )
                          .toFixed(2)
                          .split('.')[0]
                      }
                    </span>
                    <span>.</span>
                    <span>
                      {
                        parseFloat(
                          allPremiumDecayStrikes.reduce((acc, itm) => {
                            if (!isNaN(itm.total_put_decay)) {
                              return acc + itm.total_put_decay;
                            } else {
                              return acc;
                            }
                          }, 0)
                        )
                          .toFixed(2)
                          .split('.')[1]
                      }
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
        </div>
      )}
      {/* -------PREMIUM DECAY CHART----------*/}
      <PremiumDecayChart strike1={strike1} strike2={strike2} strike3={strike3} strike4={strike4} strike5={strike5} />
    </>
  );
};

export default Page;
