"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { DropDown } from "./DropDown";
import { setAuth,setUserStatus } from "@/store/authSlice";
import { useAppSelector } from "@/store";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";


const DATA = [
  {
    path: "/securitywise",
    title: "SECURITY WISE",
  },
  {
    path: "/optiondata",
    title: "OPTION CHAIN",
  },
  {
    path: "/cashflow",
    title: "MONEY FLOWS",
  },
];

const Navbar = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const storeDispatch =  useDispatch()
  const authState = useAppSelector((state) => state.auth.authState);

  const getAdvanceDecline = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTER.ADR);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching ADR data:", error);
    }
  };

  // ------------LOGOUT----------
  const logout = async () => {
    const accessToken = Cookie.get("access");
    const refreshToken = Cookie.get("refresh");
    console.log("6s6s6s2s6s1s",authState)
    console.log("6s6s6s2s6s1s",accessToken)
    console.log("6s6s6s2s6s1s",refreshToken)


    try {
      await axiosInstance.post(
        `${API_ROUTER.LOGOUT}`,
        {
          refresh: refreshToken,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      Cookie.remove("access");
      Cookie.remove("refresh");
      storeDispatch(setAuth(""))
      storeDispatch(setUserStatus(false))

      router.push('/login')
      
    } catch (error) {
      console.log("error in logout api", error);
    }
  };

  useEffect(() => {
    getAdvanceDecline();
  }, []);

  const isActive = (path) => {
    return router.pathname === path;
  };

  const handleSelectChange = (event) => {
  // authState && authState.access && router.push(event.target.value == "Live Charts" ? "/activeoi" :event.target.value == "FII DII Data" ? "/fii-dii-data" : "/multistrike");
  authState && authState.access && router.push(event.target.value);
  };

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
          {/* <DropDown
          defaultValue={"select chart"}
          button={selected => (
            console.log("select chart",selected),
              selected
          )}
          items={[{ name: "Live Charts" },{ name: "FII DII Data" },{ name: "Multi-Strike" }]}
          renderItem={({ item, isActive, onClick }) => {
            return (
              <div
                className={`${isActive} item`}
                onClick={() => {
                  onClick("",item)
                }}
              >
                {item.optionTitle && (
                  <span className="options-title">{item.optionTitle}</span>
                )}
                {item.optionTitle !== "Quick Find Recipes" ? (
                  item.option !== "See all Diet Options" ? (
                    item.graphic ? (
                      <img src={item.graphic} alt="side-dishes" />
                    ) : (
                      <GlutenFree />
                    )
                  ) : null
                ) : null}
                {item.name}
                {item.option && (
                  <span className="options-link">
                    {item.option}
                    <span className="img-arrow">
                      <AngleRight />
                    </span>
                  </span>
                )}
              </div>
            )
          }}
          onclick={handleSelectChange}
        /> */}
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
          <li> {authState && authState.access && <button onClick={logout} className="logout">Logout</button>}</li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;