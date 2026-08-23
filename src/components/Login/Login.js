import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import molecularBg from "../assets/inovapath-loginbg.webp";
import inovapathLogo from "../assets/inovapath-logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("Admin");
  const [password, setPassword] = useState("Admin");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);

    // TEMP: hardcoded Admin/Admin, no real validation yet.
    // Replace this with your actual login API once the
    // backend auth endpoint is ready — for now, Admin/Admin
    // redirects straight to the Splash screen.
    setTimeout(() => {
      setIsLoading(false);

      if (username === "Admin" && password === "Admin") {
        navigate("/splash");
      }
    }, 1200);
  };

  const handleForgotPassword = () => {
    // Replace this with your actual forgot-password flow
    // Example:
    // navigate("/forgot-password");
  };

  return (
    <div className="login-page">

      {/* =====================================================
          ANIMATED MOLECULAR BACKGROUND
          IMPORTANT:
          The blinking hexagons and moving nodes are baked
          directly into this looping WebP — no separate CSS
          animation layers are needed on top of it.
          ===================================================== */}

      <div
        className="molecular-background"
        style={{
          backgroundImage: `url(${molecularBg})`,
        }}
      />

      {/* Dark overlay */}
      <div className="background-overlay" />

      {/* =====================================================
          LEFT SIDE
          ===================================================== */}

      <section className="login-visual">
        <div className="visual-content">

          {/* Brand */}
          <div className="brand">

            <div className="logo-wrapper">
              <img
                src={inovapathLogo}
                alt="iNovaPath"
                className="brand-logo"
              />
            </div>

            <span className="brand-name">
              iNovaPath
            </span>

          </div>

          {/* Hero content */}
          <div className="hero-copy">

            <h1>
              Accelerated Drug
              <br />
              Discovery{" "}
              <span>with Gen AI</span>
            </h1>

            <p>
              The advanced iNovaPath designed for researchers
              to identify, validate, and simulate novel
              therapeutic candidates.
            </p>

          </div>

          {/* Features */}
          <div className="feature-row">

            <Feature
              icon="⌬"
              title="AI-Powered Analysis"
              text="Intelligent research"
            />

            <Feature
              icon="◉"
              title="10k+ Compounds"
              text="Extensive knowledge"
            />

            <Feature
              icon="〽"
              title="Real-time Insights"
              text="Faster decisions"
            />

          </div>

        </div>
      </section>

      {/* =====================================================
          RIGHT SIDE LOGIN
          ===================================================== */}

      <section className="login-panel">

        <div className="login-container">

          {/* Login Header */}
          <div className="login-header">

            <h2>
              Sign in to continue
            </h2>

            <p>
              Enter your research credentials
            </p>

          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* Email */}
            <div className="field">

              <label htmlFor="username">
                Username
              </label>

              <div className="input-wrapper">

                <input
                  id="username"
                  type="text"
                  placeholder="Admin"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  autoComplete="username"
                />

              </div>

            </div>

            {/* Password */}
            <div className="field">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (

                    <svg viewBox="0 0 24 24">

                      <path d="M3 3l18 18" />

                      <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                      />

                      <path
                        d="M9.9 4.3A10.7 10.7 0 0 1 12 4c7 0 10 8 10 8a17.5 17.5 0 0 1-3.1 4.6"
                      />

                      <path
                        d="M6.6 6.6C3.8 8.3 2 12 2 12s3 8 10 8a9.8 9.8 0 0 0 4.4-1"
                      />

                    </svg>

                  ) : (

                    <svg viewBox="0 0 24 24">

                      <path
                        d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8S2 12 2 12Z"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />

                    </svg>

                  )}

                </button>

              </div>

            </div>

            {/* Remember me + Forgot password */}
            <div className="remember-row">

              <label className="checkbox-label">

                <input
                  type="checkbox"
                />

                <span className="custom-checkbox" />

                Remember me

              </label>

              <button
                type="button"
                className="forgot-link"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>

            </div>

            {/* Login button */}
            <button
              type="submit"
              className={`login-button ${
                isLoading ? "loading" : ""
              }`}
              disabled={isLoading}
            >

              {isLoading ? (

                <>
                  <span className="spinner" />
                  Signing in...
                </>

              ) : (

                "Sign In"

              )}

            </button>

          </form>

        </div>

        {/* =====================================================
            FOOTER
            Sits below the login card, centered under the panel.
            ===================================================== */}

        <div className="login-footer">

          <p className="footer-copy">
            © 2026 iNovaPath Powered by Gen AI.
          </p>

          <div className="footer-links">

            <button type="button">
              Help Center
            </button>

            <button type="button">
              Privacy Policy
            </button>

            <button type="button">
              Terms of Service
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};


/* =========================================================
   FEATURE COMPONENT
   ========================================================= */

const Feature = ({
  icon,
  title,
  text,
}) => {
  return (
    <div className="feature">

      <div className="feature-icon">
        {icon}
      </div>

      <div className="feature-content">

        <strong>
          {title}
        </strong>

        <span>
          {text}
        </span>

      </div>

    </div>
  );
};

export default Login;