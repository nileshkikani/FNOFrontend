"use client";
import useAuth from "@/hooks/useAuth";
import React from "react";

const Login = () => {
  const { getData, refreshToken } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    let email = e.target.email?.value;
    let password = e.target.password?.value;
    getData({ email, password });
    setInterval(() => {
      refreshToken();
    }, 3300000); // -------55 minute-----
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
                <form
                  className="login-form"
                  action="/activeoi"
                  method="POST"
                  onSubmit={handleSubmit}
                >
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
