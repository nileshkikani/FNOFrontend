'use client'
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from 'next/dynamic';
// import axios from 'axios';
import '../global.css';
import useAuth from '@/hooks/useAuth';
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'), { ssr: false });
const ActiveMoneyFlow = dynamic(() => import('@/component/MoneyFlow-Graphs/ActiveMoneyFlow-Graph'), { ssr: false });

const Page = () => {
    const { handleResponceError } = useAuth();
    const [allData, setAllData] = useState('');
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState('');
    const [allDates, setAllDates] = useState('');
    const authState = useAppSelector((state) => state.auth.authState);
    const getStocksAndFnoData = async () => {
        try {
            setLoading(true);
            let apiUrl = `${API_ROUTER.CASH_FLOW_ALL}`;
            if (date) {
                apiUrl += `?date=${date}`;
            }
            const response = await axiosInstance.get((apiUrl), {
                headers: { Authorization: `Bearer ${authState.access}` }
            }
        );
        if (date) {
            setAllData(response.data);
            setLoading(false);
        }
        if (!allDates) {
            setAllDates(response?.data?.dates);
                setDate(response?.data?.dates[0]);
            } 
        } catch (err) {
            handleResponceError();
            // console.log('kmkmkm')
        }
    };

    useEffect(() => {
        getStocksAndFnoData()
    }, [date])

    // console.log(allDates,"mkmkm")

    return (
        <>
            <div>
                <div className="dropdown-container">
                    {!loading && (
                    <div  className="dropdown-container-date" >{allDates && (<>
                        <h1 className="table-date-text ">SELECT DATE :</h1>
                        <div className="calender-dropdown-stocks">
                        <DatePicker
                            selected={date}
                            dateFormat="yyyy-MM-dd"
                            onChange={(date) => setDate(date.toISOString().split('T')[0])}
                            includeDates={allDates}
                            placeholderText="Select a date"
                            customInput={<input readOnly />}
                            shouldCloseOnSelect
                            />
                            </div>
                    </>
                    )
                    }
                    </div>
                    )}
                </div>
            </div>
            <div>
                {loading ? (
                    <div className="loading-container">
                        <PropagateLoader color="#33a3e3" loading={loading} size={15} />
                    </div>
                ) : (
                    <div className="graph-container">
                        <div className="graph-div-cashFlow">
                            {allData?.stock_data && <ActiveMoneyFlow title={'Stock'} data={allData?.stock_data} layout="vertical" />}
                        </div>
                        <div className="graph-div-cashFlow">
                            {allData?.fno_data && <ActiveMoneyFlow title={'FNO'} data={allData?.fno_data} layout='horizontal' />}
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default Page