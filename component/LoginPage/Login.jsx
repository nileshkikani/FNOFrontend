'use client'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmail } from '@/store/userSlice';
import { setRememberMe } from '@/store/authSlice';
import { useAppSelector } from '@/store';
import useAuth from '@/hooks/useAuth';

const Login = () => {
  const { getData } = useAuth();
  const checkIsRemember = useAppSelector((state) => state.auth.rememberMe);
  const storeDispatch = useDispatch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); 

    const email = e.target.email.value;
    const password = e.target.password.value;

    storeDispatch(setEmail(email));

    try {
      await getData({ email, password });
    } catch (error) {
      console.error('Login failed:', error);
      setIsButtonDisabled(false); 
    }
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
              <div className="login-logo-div">
                <img src="/fnoLogo.png" alt="stockImage" className="login-logo" />
              </div>
              <div className="login-logo-div-transparent">
                <img src="/fnoLogoTransparent.png" alt="stockImage" className="login-logo-transparent" />
              </div>
              <form className="login-form" action="/activeoi" method="POST" onSubmit={handleSubmit}>
                <div className="input-div">
                  <label htmlFor="email" className="login-lables">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="pass-email-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="input-div">
                  <label htmlFor="password" className="login-lables">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter password"
                    className="pass-email-input"
                    required
                  />
                  <div className="remember-me-div">
                    <label htmlFor="RememberMe">
                      <input
                        type="checkbox"
                        name="RememberMe"
                        id="RememberMe"
                        className="remember-me"
                        onChange={() => storeDispatch(setRememberMe(!checkIsRemember))}
                        checked={checkIsRemember}
                      />
                      <span className="remember-text">Remember Me</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className="login-button" disabled={isButtonDisabled}>
                  {isButtonDisabled ? 'Logging in...' : 'Login'}
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
