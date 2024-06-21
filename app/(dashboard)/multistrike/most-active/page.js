'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import dynamic from 'next/dynamic';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';
import '../global.css';
import MostactiveStrike from '@/component/MostactiveStrike/MostactiveStrike-Graph';
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'), { ssr: false });

const Page = () => {
  const allExps = useAppSelector((state) => state.user.expiries);
  const authState = useAppSelector((state) => state.auth.authState);
  const [data, setData] = useState([]);
  const [lastMin, setLastMin] = useState(5);
  const [checkedExp, setCheckedExp] = useState([allExps[0]]);
  const [size, setSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const getMostActiveData = async () => {
    try {
      setIsLoading(true);
      let apiUrl = `${API_ROUTER.MOST_ACTIVE}`;
      let expiriesParam = '';
      if (checkedExp.length > 1) {
        expiriesParam = checkedExp.join(',');
      } else if (checkedExp.length === 1) {
        expiriesParam = checkedExp[0];
      }
      const response = await axiosInstance.get(`${apiUrl}?expiries=${expiriesParam}&last=${lastMin}&size=${size}`, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const renderTimeText = (value) => {
    switch (value) {
      case 5:
        return 'Last 5 minutes';
      case 10:
        return 'Last 10 minutes';
      case 15:
        return 'Last 15 minutes';
      case 30:
        return 'Last 30 minutes';
      case 60:
        return 'Last 1 hour';
      case 120:
        return 'Last 2 hours';
      case 180:
        return 'Last 3 hours';
      case 1440:
        return 'Full Day';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };

  const isCheckedExp = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      if (!checkedExp.includes(value)) {
        setCheckedExp((prevCheckedExp) => [...prevCheckedExp, value]);
      }
    } else {
      if (checkedExp.includes(value)) {
        setCheckedExp((prevCheckedExp) => prevCheckedExp.filter((item) => item !== value));
      }
    }
  };

  useEffect(() => {
    checkedExp && getMostActiveData();
  }, [lastMin, checkedExp, size]);

  // console.log(data,"fgfgf")
  return (
    <>
      {/*-----------------expiry section---------------- */}
      <div className="expiry-flex">
        <div className="expiry-div">
          <label>select expiry</label>
          {allExps?.map((itm, index) => (
            <div key={index} className="exp-date-div">
              <input
                type="checkbox"
                id={`expiry${index}`}
                value={itm}
                checked={checkedExp.includes(itm)}
                onChange={(e) => isCheckedExp(e)}
                className="exp-checkbox"
              />
              <label htmlFor={`expiry${index}`} className="exp-date-label">
                {formatDate(itm)}
              </label>
              <br />
            </div>
          ))}
        </div>
        {/*-----------------strikes above/below section---------------- */}
        <div>
          <div className="size-div">
            Strikes above/below ATM:
            {[5, 10, 15].map((value, index) => (
              <div key={index}>
                <label htmlFor={`size-${value}`} className={size == value ? 'checked-radio' : 'normal-radio'}>
                  <input
                    type="radio"
                    id={`size-${value}`}
                    value={value}
                    onChange={(e) => {
                      setSize(parseInt(e.target.value));
                    }}
                    checked={size === value}
                  />
                  {value}
                </label>
              </div>
            ))}
          </div>

          {/*-----------------time frame section---------------- */}
          <div className="time-checkbox-div">
            {[5, 10, 15, 30, 60, 120, 180, 1440].map((value, index) => (
              <div key={index}>
                <label htmlFor={`time-${value}`} className={lastMin === value ? 'checked-radio' : 'normal-radio'}>
                  <input
                    type="radio"
                    id={`time-${value}`}
                    className={`time-${value}`}
                    value={value}
                    onChange={(e) => {
                      setLastMin(parseInt(e.target.value, 10));
                    }}
                    checked={lastMin === value}
                  />
                  {renderTimeText(value)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="loading-container">
            <PropagateLoader color="#33a3e3" loading={isLoading} size={15} />
          </div>
        ) : (
          <MostactiveStrike data={data} />
        )}
      </div>
    </>
  );
};

export default Page;
