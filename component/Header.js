'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  FaAlignCenter,
  FaAngleDown,
  FaAngleUp,
  FaArrowsAltV,
  FaDatabase,
  FaMoneyBillAlt,
  FaRegChartBar,
  FaShieldVirus,
  FaTimes
} from 'react-icons/fa';
import {
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
  FaGear,
  FaRegCircleQuestion,
  FaRegMessage
} from 'react-icons/fa6';
import { createPopper } from '@popperjs/core';
import React, { useEffect, useRef, useState } from 'react';
import Cookie from 'js-cookie';
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
import useAuth from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store';
import { useCallback } from 'react';
import { setAuth, setRememberMe, setUserStatus, setUserStatusInitially } from '@/store/authSlice';
import axios from 'axios';
// import SmartAPI from 'smartapi-javascript';
import { TOTP } from 'totp-generator';
import { initializeWebSocket, socket } from '@/utils/socket';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useAuth();

  const [navBar, setNavBar] = useState(true);
  const [analyseOn, setAnalyseOn] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [profileOn, setProfileOn] = useState(false);
  const [popoverShow, setPopoverShow] = React.useState(false);
  const btnRef = React.createRef();
  const popoverRef = React.createRef();
  const [profilePopoverShow, setProfilePopoverShow] = React.useState(false);
  const profileBtnRef = React.createRef();
  const profilePopoverRef = React.createRef();
  const ref = useRef(null);
  const [getAccessCookie, setGetCookies] = useState(Cookie.get('access'));
  const [data, setData] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const storeDispatch = useDispatch();
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);
  const checkIsLoggedInInitially = useAppSelector((state) => state.auth.isCookie);
  const { refreshToken, checkTimer } = useAuth();
  const [bankNiftyPrice, setBankNiftyPrice] = useState(null);
  const [niftyPrice, setNiftyPrice] = useState(null);
  const [isClosed, setIsClosed] = useState(false);

  var http = require('http');

  // const { authenticator } = require('otplib');
  const { createDigest, keyDecoder, keyEncoder, authenticator } = require('@otplib/preset-default');
  // let { SmartAPI, WebSocket, WebSocketClient } = require('smartapi-javascript');
  // const SmartAPI = require('smartapi-javascript');

  // const smart_api = new SmartAPI({
  //   api_key: 'mFDgvhuI' // Replace with your API key
  // });

  useEffect(() => {
    // setInterval(() => {
    //   console.log('isClosed', isClosed);
    generateToken();
    // }, 1000 * 60 * 5);
  }, []);

  useEffect(() => {
    console.log('isClosed', isClosed);
    if (isClosed) {
      generateToken();
    }
  }, [!isClosed]);

  useEffect(() => {
    // Check authentication status when component mounts

    setInterval(() => {
      getAdvanceDecline();
    }, 1000 * 60);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent the default context menu from showing
        const link = e.target.closest('a');
        if (link) {
          window.open(link.href, '_blank');
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (checkIsLoggedInInitially) {
      const clrInterval = setInterval(() => {
        checkTimer();
      }, 2000);
      return () => clearInterval(clrInterval);
    }
  }, [checkIsLoggedInInitially]);

  useEffect(() => {
    if (!checkUserIsLoggedIn) {
      storeDispatch(setUserStatusInitially(false));
    }
  }, [checkUserIsLoggedIn]);

  useEffect(() => {
    closeProfilePopover();
    getAdvanceDecline();
  }, [isRefresh, pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popoverShow && !popoverRef.current?.contains(event.target) && !btnRef.current?.contains(event.target)) {
        setTimeout(() => {
          setPopoverShow(false);
        }, 1000);
      }
      if (
        profilePopoverShow &&
        !profilePopoverRef.current?.contains(event.target) &&
        !profileBtnRef.current?.contains(event.target)
      ) {
        setTimeout(() => {
          setProfilePopoverShow(false);
        }, 1000); // Adding a delay to ensure the state updates properly
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [popoverShow, profilePopoverShow]);

  async function generateToken() {
    const response = await getAccessToken();
    // console.log('RESPONSE---', response);
    if (response.status === 200) {
      const data = response?.data?.data;
      connectWebSocket(data);
    }
  }

  async function getAccessToken() {
    const url = 'https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword';
    const TOTP_SECRET_KEY = 'UKZUNOZS3WMKU33LJHSF3ZOZR4';

    const token = await TOTP.generate(TOTP_SECRET_KEY, { algorithm: 'SHA-1' });
    const data = {
      clientcode: 'METD1460',
      password: '3636',
      totp: token.otp
    };

    var config = {
      method: 'post',
      url: url,

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
        'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
        'X-MACAddress': 'MAC_ADDRESS',
        'X-PrivateKey': 'mFDgvhuI'
      },
      data: data
    };

    try {
      const response = await axios(config);
      // console.log('Access Token:', response);
      return response;
    } catch (error) {
      console.error('Error obtaining access token:');
      return error;
    }
  }

  const connectWebSocket = async (token) => {
    try {
      if (!token) {
        throw new Error('Token is required to connect WebSocket');
      }
      console.log('feedToken', token?.feedToken);

      await initializeWebSocket(token?.feedToken, setBankNiftyPrice, setNiftyPrice, setIsClosed);
    } catch (error) {
      console.error('Error in authentication or setting up WebSocket:', error);
    }
  };

  const getAdvanceDecline = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTER.ADR);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching ADR data:', error);
    }
  };

  const togglePopover = useCallback(() => {
    setPopoverShow((prevShow) => !prevShow);
  }, []);

  const toggleProfilePopover = useCallback(() => {
    setProfilePopoverShow((prevShow) => !prevShow);
  }, []);

  const openPopover = () => {
    createPopper(btnRef.current, popoverRef.current, {
      placement: 'bottom'
    });
    setPopoverShow(true);
  };

  const closePopover = () => {
    setPopoverShow(false);
  };

  const openProfilePopover = () => {
    createPopper(profileBtnRef.current, profilePopoverRef.current, {
      placement: 'bottom'
    });
    setProfilePopoverShow(true);
  };

  const closeProfilePopover = () => {
    setProfilePopoverShow(false);
  };

  const isActive = (path) => {
    console.log('path', path);
    checkUserIsLoggedIn && router.push(path);
  };

  const handleSelectChange = (event) => {
    // authState && authState.access && router.push(event.target.value == "Live Charts" ? "/activeoi" :event.target.value == "FII DII Data" ? "/fii-dii-data" : "/multistrike");
    checkUserIsLoggedIn && router.push(event.target.value);
  };

  const logout = async () => {
    try {
      await axiosInstance.post(
        `${API_ROUTER.LOGOUT}`,
        {
          refresh: authState.refresh
        },
        {
          headers: {
            Authorization: `Bearer ${authState.access}`
          }
        }
      );
      Cookie.remove('access');
      Cookie.remove('refresh');
      storeDispatch(setAuth(''));
      storeDispatch(setUserStatus(false));
      Cookie.remove('time');
      storeDispatch(setUserStatusInitially(false));
      storeDispatch(setRememberMe(false));
      router.push('/login');
    } catch (error) {
      console.log('error in logout api', error);
    }
  };

  let MenuItems = [
    {
      path: '/optiondata',
      title: 'Option Chain',
      icon: FaAlignCenter
    },
    {
      path: '/securitywise',
      title: 'Security Wise',
      icon: FaShieldVirus
    },

    {
      path: '/activeoi',
      title: 'Live Chart',
      icon: FaRegChartBar
    },

    {
      path: '/fii-dii-data/fno',
      title: 'FII DII Data',
      icon: FaDatabase
    },
    {
      path: '/multistrike',
      title: 'Multi Strike OI',
      icon: FaArrowsAltV
    }
  ];

  let ProfileMenuItems = [
    {
      path: '/account-details',
      title: 'Account Details',
      icon: FaGear
    },
    {
      path: '/',
      title: 'Help & FAQ',
      icon: FaRegCircleQuestion
    },
    {
      path: '/',
      title: 'Support',
      icon: FaRegMessage
    },
    {
      path: '/login',
      title: 'Login',
      icon: FaArrowRightFromBracket,
      hidden: checkUserIsLoggedIn
    },
    {
      title: 'Logout',
      icon: FaArrowRightToBracket,
      hidden: !checkUserIsLoggedIn
    }
  ];

  return (
    <>
      <div className="header-container" ref={ref}>
        <nav className="nav-container" onChange={handleSelectChange}>
          <div className="nav-img">
            <img
              className="nav-logo"
              onClick={() => (checkUserIsLoggedIn ? router.push('/activeoi') : router.push('/login'))}
              src="/fnoLogo.png"
              alt="Logo"
            />
            {checkUserIsLoggedIn && (
              <button className="nav-bar-logo" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <img src="/barIcon.png" alt="Logo" />
              </button>
            )}
          </div>
          {/* <div className="empty-div"></div> */}
          <div className="bank-nifty-div">
            <span className="heading-text">
              <span className="advance-text">
                Advance:
                {data ? data?.bank_nifty_advance : '...'}
              </span>
              <br />
              <span className="decline-text">
                <span className="heading-text">Decline:</span>
                {data ? data?.bank_nifty_decline : '...'}
              </span>
            </span>
            <span className="bank-nifty-heading-text">
              <span className="heading-text">
                Bank Nifty:
                {bankNiftyPrice ? bankNiftyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '...'}
              </span>
              <br />
              <span className="heading-text">
                ADR:
                {data && data?.bank_nifty_adr ? data?.bank_nifty_adr : '...'}
              </span>
            </span>
          </div>
          <div className="nav-parent">
            <ul className="nav-ul">
              {/* <div className="bank-nifty-div">
                <li className="heading-text">
                  <span className="advance-text">
                    Advance:
                    {data && data?.bank_nifty_advance ? data?.bank_nifty_advance : '...'}
                  </span>
                  <br />
                  <span className="decline-text">
                    <span className="heading-text">Decline:</span>
                    {data && data?.bank_nifty_decline ? data?.bank_nifty_decline : '...'}
                  </span>
                </li>
                <li className="heading-text">
                  <span className="heading-text">
                    Bank Nifty:
                    {data && data?.live_bank_nifty
                      ? Math.trunc(data?.live_bank_nifty).toLocaleString('en-IN', {
                          maximumFractionDigits: 0
                        })
                      : '...'}
                  </span>
                  <br />
                  <span className="heading-text">
                    ADR:
                    {data && data?.bank_nifty_adr ? data?.bank_nifty_adr : '...'}
                  </span>
                </li>
              </div> */}
              {checkUserIsLoggedIn ? (
                <div className="li-btn-parent" ref={ref}>
                  <li
                    className="nav-li-flex"
                    onClick={(e) => {
                      setAnalyseOn(!analyseOn);
                      e.stopPropagation();
                      togglePopover();
                    }}
                  >
                    Analyse
                    <button
                      onClick={(e) => {
                        setAnalyseOn(!analyseOn);
                        e.stopPropagation();
                        togglePopover();
                      }}
                    >
                      {!analyseOn ? <FaAngleDown color="black" size={16} /> : <FaAngleUp color="black" size={16} />}
                    </button>
                  </li>

                  <li className="nav-li" onClick={() => router.push('/cashflow')}>
                    Money Flow
                  </li>
                  <li className="nav-li">Orders</li>
                </div>
              ) : null}
            </ul>
          </div>
          <div className="nifty-div">
            <span className="heading-text">
              <span className="advance-text">
                Advance:
                <span className="heading-text">{data ? data?.nifty_advance : '...'}</span>
              </span>
              <br />
              <span className="decline-text">
                Decline:
                {data ? data?.nifty_decline : '...'}
              </span>
            </span>
            <span className="heading-text">
              <span className="heading-text">
                NIFTY:
                <span className="heading-text">
                  {niftyPrice ? niftyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '...'}
                </span>
              </span>
              <br />
              <span className="heading-text">ADR: {data && data?.nifty_adr ? data?.nifty_adr : '...'}</span>
            </span>
          </div>
          <div className="nav-button">
            <div className="nav-btn-parent">
              <button
                // ref={profileBtnRef}
                className="nav-btn-profile"
                onClick={(e) => {
                  setProfileOn(!profileOn);
                  setIsMobileMenuOpen(false);

                  e.stopPropagation();
                  toggleProfilePopover();
                }}
              >
                <img className="img-profile" src="/profile.png" />
              </button>
              <button
                className="icon-dropdown"
                onClick={(e) => {
                  setProfileOn(!profileOn);
                  setIsMobileMenuOpen(false);
                  e.stopPropagation();
                  toggleProfilePopover();
                }}
              >
                {!profilePopoverShow ? <FaAngleDown color="black" size={24} /> : <FaAngleUp color="black" size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {checkUserIsLoggedIn && isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <img
              className="mobile-menu-logo"
              src="/fnoLogo.png"
              alt="Logo"
              // style={{ filter: "brightness(1.5)" }}
            />
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
              <FaTimes size={24} color="#215584" />
            </button>
          </div>
          <ul className="mobile-menu-list">
            {MenuItems.map((item) => {
              const FaIcon = item?.icon;
              return (
                <li
                  key={item.path}
                  className="mobile-menu-item"
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.mobile-menu-icon').style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.mobile-menu-icon').style.color = '#344054';
                  }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    isActive(item.path);
                  }}
                >
                  {/* <Link className="mobile-menu-item" onClick={() => setIsMobileMenuOpen(false)} href={item.path}> */}
                  <FaIcon size={18} color="#344054" className="mobile-menu-icon" /> {item.title}
                  {/* <a></a>
                  </Link> */}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {popoverShow && (
        <div
          className="popover-container"
          ref={popoverRef}
          style={{ position: 'fixed', top: `${window.innerHeight * 0.09}px`, right: 0 }}
        >
          <div>
            <div className="popover-content">
              <span className="popover-heading-text">Tools to predict direction</span>
              <ul className="popover-ul">
                {MenuItems.map((item) => {
                  const FaIcon = item?.icon;
                  return (
                    <Link
                      key={item.title}
                      className="popover-li"
                      href={item.path}
                      onClick={(e) => {
                        console.log('eeeeee---', e);

                        // isActive(item.path);
                        setTimeout(() => {
                          closePopover();
                        }, 2000);
                      }}
                    >
                      <FaIcon size={18} color="#344054" /> {item?.title}
                    </Link>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {profilePopoverShow && (
        <div
          className="profile-popover-container"
          ref={profilePopoverRef}
          style={{ position: 'fixed', top: `${window.innerHeight * 0.09}px`, right: 0 }}
        >
          <div className="popover-content">
            <ul className="popover-ul">
              {ProfileMenuItems.map((item) => {
                const FaIcon = item?.icon;
                return (
                  <li key={item.title}>
                    {item.title === 'Login' && !checkUserIsLoggedIn ? (
                      <Link href={item.path} className="popover-li">
                        <FaIcon size={18} color="#344054" /> {item.title}
                      </Link>
                    ) : item.title === 'Logout' && checkUserIsLoggedIn ? (
                      <button onClick={logout}>
                        <div className="popover-li">
                          <FaIcon size={18} color="#344054" /> {item.title}
                        </div>
                      </button>
                    ) : item.title === 'Logout' || item.title === 'Login' ? null : (
                      <Link href={item.path} className="popover-li">
                        <FaIcon size={18} color="#344054" /> {item.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
