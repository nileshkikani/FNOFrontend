'use client';
import React, { useEffect, useState } from 'react';
import './global.css';
import axios from 'axios';
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

  const [decayValue, setDecayValue] = useState();
  const [allPremiumDecayStrikes, setAllPremiumDecayStrikes] = useState([]);
  // const [selectedPremiumDecayStrikes,setSelectedPremiumDecayStrikes] = useState([])

  const selectedPremiumDecayStrikes = []

  //--------PREMIUM DECAY STRIKE STATES--------
  const [strike1, setStrike1] = useState();
  const [strike2, setStrike2] = useState();
  const [strike3, setStrike3] = useState();
  const [strike4, setStrike4] = useState();
  const [strike5, setStrike5] = useState();

  // ---------PREMIUM DECAY API CALL-----------
  const premiumDecayApiCall = async () => {
    try {
      let apiUrl = API_ROUTER.PREMIUM_DECAY;
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setDecayValue(response.data.data);
      setAllPremiumDecayStrikes(response.data);
    } catch (error) {
      console.log('error calling premium decay api', error);
    }
  };

  console.log("erree",allPremiumDecayStrikes)
 
  const checkPremiumDecayStrike = (e, identifier) => {
    // console.log(e.target.value,"oooo")
    // console.log("insiddeduncc")
    const filteredData = allPremiumDecayStrikes?.filter((itm) => itm?.strike_price === e.target.value);
    // const { value, checked } = e.target;
    // if (checked) {
    //   dispatch({ type: 'ADD_SELECTED_STRIKE', payload: value });
    // } else {
    //   dispatch({ type: 'REMOVE_SELECTED_STRIKE', payload: value });
    // }

    switch (identifier) {
      case 1:
       const filteredStrikeData1 = allPremiumDecayStrikes.filter((itm)=>itm.strike_price == e.target.value);
       console.log(filteredStrikeData1)
        setStrike1(filteredStrikeData1[0]?.data);
        console.log(strike1,"pppp1")
        // selectedPremiumDecayStrikes.includes(e.target.values) ? 
        // selectedPremiumDecayStrikes.push(e.target.value);
        break;
      case 2:
        const filteredStrikeData2 = allPremiumDecayStrikes.filter((itm)=>itm.strike_price == e.target.value);
        setStrike2(filteredStrikeData2[0]?.data);
        console.log(strike2,"pppp2") 
        // selectedPremiumDecayStrikes.push(e.target.value);
        break;
      case 3:
        const filteredStrikeData3 = allPremiumDecayStrikes.filter((itm)=>itm.strike_price == e.target.value);
        setStrike3(filteredStrikeData3[0]?.data);
        console.log(strike3,"pppp3")
        // selectedPremiumDecayStrikes.push(e.target.value);/
        break;
      case 4:
        const filteredStrikeData4 = allPremiumDecayStrikes.filter((itm)=>itm.strike_price == e.target.value);
        setStrike4(filteredStrikeData4[0]?.data);
        console.log(strike4,"pppp4")
        // selectedPremiumDecayStrikes.push(e.target.value);/
        break;
      case 5:
        const filteredStrikeData5 = allPremiumDecayStrikes.filter((itm)=>itm.strike_price == e.target.value);
        setStrike5(filteredStrikeData5[0]?.data);
        console.log(strike5,"pppp5")
        // selectedPremiumDecayStrikes.push(e.target.value);
        break;
      default:
        break;
    }
  }


  useEffect(() => {
    if (strikes.length > 0) {
      const thirdCheckboxValue = strikes[2];
      checkSelectedStrike({ target: { value: thirdCheckboxValue, checked: true } }, 3);
    }
  }, [strikes]);

  useEffect(()=>{
    checkPremiumDecayStrike();
  },[strike1,strike2,strike3,strike4,strike5])


  useEffect(() => {
    premiumDecayApiCall();
    multiStrikeAPiCall();
  }, []);

  // console.log("Rr",totalDecayValues)
  return (
    <>
      {/* -----------MULTISTRIKE SECTION--------- */}
      <div className="checkbox-container">
        {strikes.map((itm, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`strike${index}`}
              value={itm}
              checked={selectedStrikePrices.includes(itm)}
              onChange={(e) => checkSelectedStrike(e, index + 1)}
            />
            <label htmlFor={`strike${index}`}>{`${itm}`}</label>
            <span className={`color-dot color-dot-${index}`}></span>
            <br />
          </div>
        ))}
      </div>
      {/* -------MULTISTRIKE CHART--------- */}
      <MultiStrikeChart />
      {/* -----------PREMIUM DECAY SECTION--------- */}
      <div className="strike-dropdown">
        <label>Select Strike</label>
        <div className="checkbox-container">
          {allPremiumDecayStrikes?.map((itm, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`strike${index}`}
                value={itm.strike_price}
                checked={selectedPremiumDecayStrikes.includes(itm)}
                onChange={(e) => checkPremiumDecayStrike(e, index + 1)}
              />
              <label htmlFor={`strike${index}`}>{itm.strike_price}</label>
              <br />
            </div>
          ))}
        </div>
        <div className="total-decay-values">
          <label>total call decay: {allPremiumDecayStrikes?.total_call_decay}</label>
          <label>total put decay: {allPremiumDecayStrikes?.total_put_decay}</label>
        </div>
      </div>
      {/* -------PREMIUM DECAY CHART----------*/}
      <PremiumDecayChart val={decayValue} />
    </>
  );
};

export default Page;
