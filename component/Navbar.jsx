"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";
import useAuth from "@/hooks/useAuth";
import axios from "axios";

// --------------ICONS-------------
// import { FaChartLine } from "react-icons/fa";
// import AdvanceDecline from "@/component/AdvanceDecline";

// --------------LOGOUT----------------
const logout = async () => {
  try {
    const getAccessCookie = Cookies.get("access");
    const getRefreshCookie = Cookies.get("refresh");

    // console.log("this is access cookie", getAccessCookie);
    // console.log("this is refresh cookie", getRefreshCookie);

    await axiosInstance.post(
      `${API_ROUTER.LOGOUT}`,
      {
        refresh: getRefreshCookie,
      },
      {
        headers: {
          Authorization: `Bearer ${getAccessCookie}`,
        },
      }
    );
    Cookies.remove("access");
    Cookies.remove("refresh");
    window.location.reload();
  } catch (error) {
    console.log("error in logout api", error);
  }
};

const DATA = [
  {
    path: "/securitywise",
    title: "STOCK DAILY DATA",
  },
  // {
  //   path: "/stockdata",
  //   title: "STOCK DAILY DATA",
  // },
  {
    path: "/optiondata",
    title: "OPTION LIST",
  },
  {
    path: "/niftyfutures",
    title: "NIFTY FUTURES",
  },
  {
    path: "/cashflow",
    title: "MONEY FLOWS",
  },
];

const Navbar = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const { checkIsLoggedin } = useAuth();
  // const [logoutShow,setLogoutShow] = useState(false);
  // const checkCookie = Cookies.get('access');

  // if(isLoggedIn == false ){
  //   setLogoutShow(true)
  // }

  const getAdvanceDecline = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTER.ADR);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ADR data:", error);
    }
  };

  useEffect(() => {
    // console.log("current state is::: form navbar use effect::",isLoggedIn)
    getAdvanceDecline();
    const interval = setInterval(() => {
      getAdvanceDecline();
    }, 60000); // 60000 milliseconds = 1 minute
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    return router.pathname === path;
  };

  const handleSelectChange = (event) => {
    const selectedPath = event.target.value;
    router.push(selectedPath);
  };
  const getAccessCookie = Cookies.get("access");
  const getRefreshCookie = Cookies.get("refresh");
  // const defaultOption = { value: "", label: "select chart" };

  return (
    <>
      <div className="nav-div">
        <ul className="navbar-full">
          <li>
            <span className="advance">
              Advance:{" "}
              {data && data?.bank_nifty_advance
                ? data?.bank_nifty_advance
                : "..."}
            </span>{" "}
            <br />
            <span className="decline">
              {" "}
              Decline:{" "}
              {data && data?.bank_nifty_decline
                ? data?.bank_nifty_decline
                : "..."}
            </span>
          </li>
          <li>
            <span>
              BANK NIFTY:{" "}
              {data && data?.live_bank_nifty
                ? Math.trunc(data?.live_bank_nifty).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })
                : "..."}
            </span>{" "}
            <br />
            <span>
              ADR: {data && data?.bank_nifty_adr ? data?.bank_nifty_adr : "..."}
            </span>
          </li>
          {DATA?.map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                href={item?.path}
                className={isActive(item.path) ? "active-link" : ""}
              >
                {item.title}
              </Link>
            </li>
          ))}
          <li>
            <select className="nav-div " onChange={handleSelectChange}>
              <option disabled selected value>
                select chart
              </option>
              <option value="/activeoi" className="nav-item nav-dropdown ">
                Live Charts
              </option>
              <option value="/fii-dii-data" className="nav-item">
                FII DII Data
              </option>
              <option value="/multistrike" className="nav-item">
                Multi-Strike
              </option>
            </select>
          </li>
          <li>
            <span className="advance">
              Advance:{" "}
              {data && data?.nifty_advance ? data?.nifty_advance : "..."}
            </span>{" "}
            <br />
            <span className="decline">
              {" "}
              Decline:{" "}
              {data && data?.nifty_advance ? data?.nifty_decline : "..."}
            </span>
          </li>
          <li>
            <span>
              NIFTY:{" "}
              {data && data?.live_nifty
                ? Math.trunc(data?.live_nifty).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })
                : "..."}
            </span>{" "}
            <br />
            <span>
              ADR: {data && data?.nifty_adr ? data?.nifty_adr : "..."}
            </span>
          </li>
          <li>
            {" "}
            {getAccessCookie && getRefreshCookie && (
              <button onClick={logout}>logout</button>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
