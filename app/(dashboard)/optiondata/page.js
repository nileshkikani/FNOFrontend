'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/store';
import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';
import './global.css';

// ----------ARROW ICONS---------
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from 'react-icons/io';

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  const [apiData, setApiData] = useState([]);
  const { handleResponceError } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const authState = useAppSelector((state) => state.auth.authState);
  const expiryDropDown = useAppSelector((state) => state.user.expiries);
  const [selectedExp, setSelectedExp] = useState(expiryDropDown[0]);
  const [mostActiveStrikeTable, setMostActiveStrikeTable] = useState([])

  //---------OPTION CHAIN CALL----------
  const getData = async () => {
    setIsLoading(true);
    try {
      if (selectedExp) {
        await axiosInstance
          .get(`${API_ROUTER.OPTIONDATA_LIST}?expiry=${selectedExp}`, {
            headers: { Authorization: `Bearer ${authState.access}` }
          }
          )
          .then((response) => {
            setApiData(response.data.option_chain_data.reverse());
            setMostActiveStrikeTable(response.data.most_active_strikes);
            setIsLoading(false);
          })
          .catch((err) => handleResponceError());
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      handleResponceError();
    }
  };

  useEffect(() => {
    authState && getData();
  }, [authState, selectedExp]);

  return (
    <div>
      <h1 className="table-title">Most Active Strikes </h1>
      <div>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th>STRIKE PRICE</th>
              <th>OPTION TYPE</th>
              <th>PERCENTAGE OF OI CHANGE</th>
              <th>LTP</th>
              <th>VOLUME</th>
              <th>NET OI</th>
              <th>IV</th>
            </tr>
          </thead>
          <tbody>
            {mostActiveStrikeTable.map((item, index) => (
              <tr key={index} >
                <td>{Number(item?.strike_price).toLocaleString('en-IN')}</td>
                <td className={item.option_type == 'put' ? 'red-field' : 'green-field'}>{item?.option_type}</td>
                <td>{item?.percentage} %</td>
                <td>{item?.ltp}</td>
                <td>{Number(item?.volume).toLocaleString('en-IN')}</td>
                <td>{Number(item?.net_oi).toLocaleString('en-IN')}</td>
                <td>{item?.iv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h1 className="table-title">Option Chain </h1>
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
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: '50px',
            height: '80vh'
          }}
        >
          <PropagateLoader color="#33a3e3" loading={isLoading} size={15} />
        </div>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Interpretation</th>
                <th>CALL VOLUME</th>
                <th>CALL NET OI</th>
                <th>CALL CHANGE OI</th>
                <th>CALL PRICE CHANGE </th>
                <th>CALL OI % CHANGE</th>
                <th>CALL LTP</th>
                <th>STRIKE</th>
                <th>PUT LTP</th>
                <th>PUT OI % CHANGE</th>
                <th>PUT PRICE CHANGE </th>
                <th>PUT CHANGE OI</th>
                <th>PUT NET OI</th>
                <th>PUT VOLUME</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {apiData?.map((item) => (
                <tr key={item?.id}>
                  <td
                    className={
                      item.call_price_change < 0 && item.call_change_oi > 0
                        ? 'red-field'
                        : item.call_price_change > 0 && item.call_change_oi < 0
                          ? 'green-field'
                          : item.call_price_change > 0 && item.call_change_oi > 0
                            ? 'red-field'
                            : 'green-field'
                    }
                  >
                    {item.call_price_change < 0 && item.call_change_oi > 0 && (
                      <span className="inside-cell">
                        short buildup <IoMdArrowRoundDown size={25} style={{ color: 'red' }} />
                      </span>
                    )}
                    {item.call_price_change > 0 && item.call_change_oi < 0 && (
                      <span className="inside-cell">
                        short covering <IoMdArrowRoundUp size={25} style={{ color: 'green' }} />
                      </span>
                    )}
                    {item.call_price_change > 0 && item.call_change_oi > 0 && (
                      <span className="inside-cell">
                        long buildup <IoMdArrowRoundDown size={25} style={{ color: 'red' }} />
                      </span>
                    )}
                    {item.call_price_change < 0 && item.call_change_oi < 0 && (
                      <span className="inside-cell">
                        long covering <IoMdArrowRoundUp size={25} style={{ color: 'green' }} />
                      </span>
                    )}
                  </td>
                  <td>{Number(item?.call_volume).toLocaleString('en-IN')}</td>
                  <td>{Number(item?.call_net_oi).toLocaleString('en-IN')}</td>
                  <td className={item.call_change_oi < 0 ? 'red-field' : 'green-field'}>
                    {item.call_change_oi < 0 ? (
                      <>
                        <span className="inside-cell">
                          {Number(item.call_change_oi).toLocaleString('en-IN')}{' '}
                          <IoMdArrowRoundDown size={25} style={{ color: 'red' }} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inside-cell">
                          {Number(item.call_change_oi).toLocaleString('en-IN')}{' '}
                          <IoMdArrowRoundUp size={25} style={{ color: 'green' }} />
                        </span>
                      </>
                    )}
                  </td>
                  <td className={item.call_price_change < 0 ? 'red-field' : 'green-field'}>
                    {item.call_price_change < 0 ? (
                      <>
                        <span className="inside-cell">
                          {Number(item.call_price_change).toLocaleString('en-IN')}{' '}
                          <IoMdArrowRoundDown size={25} style={{ color: 'red' }} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inside-cell">
                          {Number(item.call_price_change).toLocaleString('en-IN')}{' '}
                          <IoMdArrowRoundUp size={25} style={{ color: 'green' }} />
                        </span>
                      </>
                    )}
                  </td>
                  <td>{item?.call_change_oi_percentage}{'%'}</td>
                  <td>{Number(item?.call_ltp).toLocaleString('en-IN')}</td>
                  <td>{Number(item?.strike_price).toLocaleString('en-IN')}</td>
                  <td>{Number(item?.put_ltp).toLocaleString('en-IN')}</td>
                  <td>{item?.put_change_oi_percentage}{'%'}</td>
                  <td className={item.put_price_change < 0 ? 'red-field' : 'green-field'}>
                    {' '}
                    {item.put_price_change < 0 ? (
                      <>
                        <span className="inside-cell">
                          {Number(item.put_price_change).toLocaleString('en-IN')}{' '}
                          <IoMdArrowRoundDown size={25} style={{ color: 'red' }} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inside-cell">
                          {Number(item.put_price_change).toLocaleString('en-IN')}{' '}
                          <IoMdArrowRoundUp size={25} style={{ color: 'green' }} />
                        </span>
                      </>
                    )}
                  </td>
                  <td className={item.put_change_oi < 0 ? 'red-field' : 'green-field'}>
                    {item.put_change_oi < 0 ? (
                      <>
                        <span className="inside-cell">
                          {Number(item.put_change_oi).toLocaleString('en-IN')}{' '}
                          <IoMdArrowRoundDown size={25} style={{ color: 'red' }} />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inside-cell">
                          {Number(item.put_change_oi).toLocaleString('en-IN')}{' '}
                          <IoMdArrowRoundUp size={25} style={{ color: 'green' }} />
                        </span>
                      </>
                    )}
                  </td>
                  <td>{Number(item?.put_net_oi).toLocaleString('en-IN')}</td>
                  <td>{Number(item?.put_volume).toLocaleString('en-IN')}</td>
                  <td
                    className={
                      item.put_price_change < 0 && item.put_change_oi > 0
                        ? 'red-field'
                        : item.put_price_change > 0 && item.put_change_oi < 0
                          ? 'green-field'
                          : item.put_price_change > 0 && item.put_change_oi > 0
                            ? 'red-field'
                            : 'green-field'
                    }
                  >
                    {item.put_price_change < 0 && item.put_change_oi > 0 && (
                      <span className="inside-cell">
                        short buildup <IoMdArrowRoundDown size={25} style={{ color: 'red' }} />
                      </span>
                    )}
                    {item.put_price_change > 0 && item.put_change_oi < 0 && (
                      <span className="inside-cell">
                        short covering <IoMdArrowRoundUp size={25} style={{ color: 'green' }} />
                      </span>
                    )}
                    {item.put_price_change > 0 && item.put_change_oi > 0 && (
                      <span className="inside-cell">
                        long buildup <IoMdArrowRoundDown size={25} style={{ color: 'red' }} />
                      </span>
                    )}
                    {item.put_price_change < 0 && item.put_change_oi < 0 && (
                      <span className="inside-cell">
                        long covering <IoMdArrowRoundUp size={25} style={{ color: 'green' }} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
