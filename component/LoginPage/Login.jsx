'use client';
import useAuth from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import React from 'react';

const Login = () => {
  const { getData, refreshToken } = useAuth();
  const authState = useAppSelector((state) => state.auth.authState);

  const handleSubmit = (e) => {
    e.preventDefault();
    let email = e.target.email?.value;
    let password = e.target.password?.value;
    getData({ email, password });
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
