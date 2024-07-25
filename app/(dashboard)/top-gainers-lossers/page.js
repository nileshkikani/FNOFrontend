'use client'
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import useAuth from '@/hooks/useAuth';

const Page = () => {
    const { handleResponceError } = useAuth();
    const [apiData, setApiData] = useState([]);
    const authState = useAppSelector((state) => state.auth.authState);

    const getGainersLossers = async () => {
        try {
            let endPoint = API_ROUTER.TOP_GAINER_LOSSER
            const response = await axiosInstance.get(endPoint, {
                headers: { Authorization: `Bearer ${authState.access}` }
            })
            setApiData(response.data);
        } catch (error) {
            handleResponceError()
        }
    }

    useEffect(() => {
        getGainersLossers()
    }, [])

    return (
        <>
            <div>
            <h1>GAINERS</h1>
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
                            <tr key={index}>
                                <td>{item.symbol}</td>
                                <td>{item.last_price}</td>
                                <td>{item.change}</td>
                                <td>{item.percentage_change}%</td>
                                <td>{item.day_high}</td>
                                <td>{item.day_low}</td>
                                <td>{item.year_high}</td>
                                <td>{item.year_low}</td>
                                <td>{item.previous_close}</td>
                                <td>{item.open}</td>
                                <td>{Number(item?.total_traded_volume).toLocaleString('en-IN')}</td>
                                <td>{Number(item?.total_traded_value).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <h1>LOSSERS</h1>
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
                            <tr key={index}>
                                <td>{item.symbol}</td>
                                <td>{item.last_price}</td>
                                <td>{item.change}</td>
                                <td>{item.percentage_change}%</td>
                                <td>{item.day_high}</td>
                                <td>{item.day_low}</td>
                                <td>{item.year_high}</td>
                                <td>{item.year_low}</td>
                                <td>{item.previous_close}</td>
                                <td>{item.open}</td>
                                <td>{Number(item?.total_traded_volume).toLocaleString('en-IN')}</td>
                                <td>{Number(item?.total_traded_value).toLocaleString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Page