'use client';
import useAuth from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setRememberMe } from '@/store/authSlice';

const Login = () => {
  const { getData, refreshToken } = useAuth();
  const authState = useAppSelector((state) => state.auth.authState);
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
      <div>
        <section>
          <div className="login-parent">
            <div className="login-div-nested">
              <div>
                <h1 className="login-title">Login</h1>
                <form className="login-form" action="/activeoi" method="POST" onSubmit={handleSubmit}>
                  <div>
                    <label htmlfor="email" className="login-lables ">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="pass-email-field  "
                      placeholder="enter your email"
                      required=""
                    />
                  </div>
                  <div>
                    <label for="password" className="login-lables ">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="enter password"
                      className="pass-email-field"
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

                  <button type="submit" className="login-btn">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Login;
