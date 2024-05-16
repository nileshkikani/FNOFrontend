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
              <h1 className="login-title-text">Login</h1>
              <form className="" action="/activeoi" method="POST" onSubmit={handleSubmit}>
                <div>
                  <label htmlfor="email" className="login-lable ">
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
                <div>
                  <label for="password" className="login-lable ">
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
                </div>
                <div>
                    <label for="RememberMe" className="login-lables">
                      <input
                        type="checkbox"
                        name="RememberMe"
                        id="RememberMe"
                        // className="pass-email-field"
                        required=""
                        onChange={() => storeDispatch(setRememberMe(!checkIsRemember))}
                      />
                      Remember Me
                    </label>
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
