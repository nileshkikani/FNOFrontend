'use client'
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';
import './global.css';
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

const Page = () => {
    const { handleResponceError } = useAuth();
    const [apiData, setApiData] = useState([]); 
    const [loading, setLoading] = useState(false);
    const authState = useAppSelector((state) => state.auth.authState);

    const getGainersLossers = async () => {
        try {
            setLoading(true);
            let endPoint = API_ROUTER.TOP_GAINER_LOSSER
            const response = await axiosInstance.get(endPoint, {
                headers: { Authorization: `Bearer ${authState.access}` }
            })
            setApiData(response.data);
            setLoading(false);
        } catch (error) {
            handleResponceError()
        }
    }

    useEffect(() => {
        getGainersLossers()
    }, [])

    return (
        <>{!loading ? (<>
        <div>
            <h1 className='table-title1'>GAINERS</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Last Price</th>
                            <th>Change</th>
                            <th>Percentage Change</th>
                            <th>Day High</th>
                            <th>Day Low</th>
                            <th>Year High</th>
                            <th>Year Low</th>
                            <th>Previous Close</th>
                            <th>Open</th>
                            <th>Total Traded Volume</th>
                            <th>Total Traded Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiData?.gainers?.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'row-light-color' : 'row-dark-color'}>
                                <td className='td-cell'>{item.symbol}</td>
                                <td className='td-cell'>{item.last_price}</td>
                                <td className={item.change>0?'positive td-cell':'negative td-cell'}>{item.change}</td>
                                <td className={item.percentage_change>0?'positive td-cell':'negative td-cell'}>{item.percentage_change}%</td>
                                <td className='td-cell' >{item.day_high}</td>
                                <td className='td-cell'>{item.day_low}</td>
                                <td className='td-cell'>{item.year_high}</td>
                                <td className='td-cell'>{item.year_low}</td>
                                <td className='td-cell'>{item.previous_close}</td>
                                <td className='td-cell'>{item.open}</td>
                                <td className='td-cell'>{Number(item?.total_traded_volume).toLocaleString('en-IN')}</td>
                                <td className='td-cell'>{Number(item?.total_traded_value).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h1  className='table-title1'>LOSSERS</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Last Price</th>
                            <th>Change</th>
                            <th>Percentage Change</th>
                            <th>Day High</th>
                            <th>Day Low</th>
                            <th>Year High</th>
                            <th>Year Low</th>
                            <th>Previous Close</th>
                            <th>Open</th>
                            <th>Total Traded Volume</th>
                            <th>Total Traded Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiData?.losers?.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'row-light-color' : 'row-dark-color'}>
                                <td className='td-cell'>{item.symbol}</td>
                                <td className='td-cell'>{item.last_price}</td>
                                <td className={item.change<0?'negative td-cell':'positive td-cell'}>{item.change}</td>
                                <td className={item.percentage_change<0?'negative td-cell':'positive td-cell'}>{item.percentage_change}%</td>
                                <td  className='td-cell'>{item.day_high}</td>
                                <td className='td-cell'>{item.day_low}</td>
                                <td className='td-cell'>{item.year_high}</td>
                                <td className='td-cell'>{item.year_low}</td>
                                <td className='td-cell'>{item.previous_close}</td>
                                <td className='td-cell'>{item.open}</td>
                                <td className='td-cell'>{Number(item?.total_traded_volume).toLocaleString('en-IN')}</td>
                                <td className='td-cell'>{Number(item?.total_traded_value).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        
        </>):(<>
            <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}
    >
      <PropagateLoader color="#33a3e3" loading={true} size={15} />
    </div>
        </>)}
            
        </>
    )
}

export default Page;