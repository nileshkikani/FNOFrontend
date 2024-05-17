'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/store';
import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  const [apiData, setApiData] = useState([]);
  const { handleResponceError } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const authState = useAppSelector((state) => state.auth.authState);

  const getData = async (page) => {
    setIsLoading(true);
    await axiosInstance
      .get(`${API_ROUTER.OPTIONDATA_LIST}?page=${page}`, {
        headers: { Authorization: `Bearer ${authState.access}` }
      })
      .then((response) => {
        setApiData(response.data.results);
        setIsLoading(false);
      })
      .catch((err) => handleResponceError());
  };

  useEffect(() => {
    authState && getData(currentPage);
  }, [currentPage, authState]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="main-div">
      <div>
        <h1 className="table-title">Option Data Page </h1>
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
            <div className="table-div">
              <table>
                <thead>
                  <tr>
                    <th>CREATED AT</th>
                    <th>CALL NET OI</th>
                    <th>CALL PRICE CHANGE </th>
                    <th>CALL VOLUME</th>
                    <th>CALL CHANGE OI</th>
                    <th>CALL LTP</th>
                    <th>STRIKE</th>
                    <th>PUT LTP</th>
                    <th>PUT CHANGE OI</th>
                    <th>PUT VOLUME</th>
                    <th>PUT PRICE CHANGE </th>
                    <th>PUT NET OI</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData?.map((item) => (
                    <tr key={item?.id}>
                      <td>{new Date(item?.created_at).toLocaleString()}</td>
                      <td>{item?.call_net_oi}</td>
                      <td>{item?.call_price_change}</td>
                      <td>{item?.call_volume}</td>
                      <td>{item?.call_change_oi}</td>
                      <td>{item?.call_ltp}</td>
                      <td>{item?.strike_price}</td>
                      <td>{item?.put_ltp}</td>
                      <td>{item?.put_change_oi}</td>
                      <td>{item?.put_volume}</td>
                      <td>{item?.put_price_change}</td>
                      <td>{item?.put_net_oi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="btndiv">
          {currentPage === 1 ? (
            ''
          ) : (
            <button className="prevbtn" onClick={handlePrevious}>
              previous
            </button>
          )}
          <button className="nextbtn" onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </div>
  );
}
