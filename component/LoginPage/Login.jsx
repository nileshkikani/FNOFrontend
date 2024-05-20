'use client';
import useAuth from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setRememberMe } from '@/store/authSlice';

const Login = () => {
  const { getData, refreshToken } = useAuth();
  const checkIsRemember = useAppSelector((state) => state.auth.rememberMe);
  const storeDispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    let email = e.target.email?.value;
    let password = e.target.password?.value;
    getData({ email, password });
    // if(checkIsRemember){
    //   refreshToken();
    // }
    // setInterval(() => {
    //   refreshToken();
    // }, 15000); // -------55 minute(3300000)---
    // window.location.reload();
  };

  return (
    <>
      <div className="login-div-main">
        <div className="stock-image-div">
          <img src="/stockImage.webp" alt="stockImage" className="stock-image" />
        </div>
        <div className="login-parents">
          <div className="login-nested-div">
            <div>
              {/* <h1 className="login-title-text"> */}
              {/* </h1> */}
              <div className="login-logo-div">
                <img src="/fnoLogo.png" alt="stockImage" className="login-logo" />
              </div>
              <form className="login-form" action="/activeoi" method="POST" onSubmit={handleSubmit}>
                <div className="input-div">
                  <label htmlfor="email" className="login-lables ">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="pass-email-input"
                    placeholder="Enter your email"
                    required=""
                  />
                </div>
                <div className="input-div">
                  <label for="password" className="login-lables ">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    className="pass-email-input"
                    required=""
                  />
                  <div className="rember-me-div">
                    <label for="RememberMe">
                      <input
                        type="checkbox"
                        name="RememberMe"
                        id="RememberMe"
                        className="remember-me"
                        // className="pass-email-field"
                        required=""
                        onChange={() => storeDispatch(setRememberMe(!checkIsRemember))}
                        checked={checkIsRemember}
                      />
                      <span className="remember-text">Remember Me</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className="login-button">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
