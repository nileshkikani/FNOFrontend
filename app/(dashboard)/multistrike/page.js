'use client';
import React, { useEffect, useState } from 'react';
import './global.css';
// import axios from 'axios';
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';

//---------CHARTS-----------
import MultiStrikeChart from '@/component/MultiStrikeChart/MultiStrikeChart';
import useMultiStrikeData from '@/hooks/useMultiStrikeData';
import PremiumDecayChart from '@/component/PremiumDecay-Graphs/PremiumDecay';

const Page = () => {
  const { strikes, checkSelectedStrike, multiStrikeAPiCall, selectedStrikePrices } = useMultiStrikeData();
  const authState = useAppSelector((state) => state.auth.authState);
  const [selectedPremiumDecay, setSelectedPremiumDecay] = useState([]);

  const [decayValue, setDecayValue] = useState();
  const [allPremiumDecayStrikes, setAllPremiumDecayStrikes] = useState([]);


  //--------PREMIUM DECAY STRIKE STATES--------
  const [strike1, setStrike1] = useState([]);
  const [strike2, setStrike2] = useState([]);
  const [strike3, setStrike3] = useState([]);
  const [strike4, setStrike4] = useState([]);
  const [strike5, setStrike5] = useState([]);

  // ---------PREMIUM DECAY API CALL-----------
  const premiumDecayApiCall = async () => {
    try {
      let apiUrl = API_ROUTER.PREMIUM_DECAY;
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setDecayValue(response.data.data);
      setAllPremiumDecayStrikes(response.data);
    } catch (error) {
      console.log('error calling premium decay api', error);
    }
  };

  // console.log('erree', allPremiumDecayStrikes);

  const checkPremiumDecayStrike = (e, identifier) => {
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
    premiumDecayApiCall();
    multiStrikeAPiCall();
  }, []);

  useEffect(() => {
    if (allPremiumDecayStrikes.length > 0) {
      checkPremiumDecayStrike({ target: { value: allPremiumDecayStrikes[2].strike_price, checked: true } }, 3);
    }
  }, [allPremiumDecayStrikes]);
  // console.log("selss",selectedStrikePrices)
  // console.log("sskk",strikes)
  return (
    <>
      {/* -----------MULTISTRIKE SECTION--------- */}
      <div className="checkbox-container-mulistrike">
        {strikes.map((itm, index) => (
          <div key={index} className='checkbox-div-multistrike'>
            {/* {console.log("qw",itm,"reeerr",selectedStrikePrices)} */}
            <input
              type="checkbox"
              id={`strike${index}`}
              value={itm}
              checked={selectedStrikePrices.includes(itm)}
              onChange={(e) => checkSelectedStrike(e, index + 1)}
              className='checkboxes-itself'
            />
            <label htmlFor={`strike${index}`}>{itm}</label>
            <span className={`color-dot color-dot-${index}`}></span>
            <br />
          </div>
        ))}
      </div>
      {/* -------MULTISTRIKE CHART--------- */}
      <MultiStrikeChart />
      {/* -----------PREMIUM DECAY SECTION--------- */}
      <div className="checkbox-container">
        {allPremiumDecayStrikes?.map((itm, index) => (
          <div key={index} >
            {/* {console.log("bsabcbsdbds==<><><>",itm,"ji",selectedPremiumDecay)} */}
            <input
              type="checkbox"
              id={`decay${index}`}
              value={itm.strike_price}
              checked={selectedPremiumDecay.includes(itm.strike_price)}
              onChange={(e) => checkPremiumDecayStrike(e, index + 1)}
              className='checkboxes-itself' 
            />
            <label htmlFor={`strike${index}`}>{itm.strike_price}</label>
            <span className={`color-dot color-dot-${index}`}></span>
           &nbsp;&nbsp;
            <label>call decay of last 45 minutes:<span className={itm.last_9_call_decay_sum<0?'last45mindecay-red':'last45mindecay-green'}>{itm.last_9_call_decay_sum}</span></label>|  
            <label> put decay of last 45 minutes:<span className={itm.last_9_put_decay_sum<0?'last45mindecay-red':'last45mindecay-green'}>{itm.last_9_put_decay_sum}</span></label>|
            <label> total call decay:<span className={itm.total_call_decay<0?'last45mindecay-red':'last45mindecay-green'}>{itm.total_call_decay}</span></label>|
            <label> total put decay:<span className={itm.total_put_decay<0?'last45mindecay-red':'last45mindecay-green'}>{itm.total_put_decay}</span></label> 
            <br />
          </div>
        ))}
      </div>

      {/* <div className="total-decay-values">
          <label>total call decay: {allPremiumDecayStrikes?.total_call_decay}</label>
          <label>total put decay: {allPremiumDecayStrikes?.total_put_decay}</label>
        </div>
      </div> */}
      {/* -------PREMIUM DECAY CHART----------*/}
      <PremiumDecayChart strike1={strike1} strike2={strike2} strike3={strike3} strike4={strike4} strike5={strike5} />
    </>
  );
};

export default Page;
