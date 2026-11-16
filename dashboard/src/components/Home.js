import React, { useEffect, useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import apiClient from "../api";
import "./AccountGate.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const frontendUrl = (
    process.env.REACT_APP_FRONTEND_URL ||
    (process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000")
  ).replace(/\/$/, "");

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .get("/auth/me", { signal: controller.signal })
      .then((response) => setUser(response.data.user))
      .catch((error) => {
        if (error.code !== "ERR_CANCELED" && error.response?.status !== 401) {
          setSessionError("Unable to connect to the backend. Please try again.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsCheckingSession(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
      setSessionError("");
    } catch (error) {
      setSessionError(
        error.response?.data?.message || "Unable to sign out. Please try again."
      );
    }
  };

  if (isCheckingSession) {
    return (
      <main className="account-gate">
        <div className="account-gate-loading" role="status">
          <span className="account-gate-spinner" aria-hidden="true" />
          <span>Checking your account...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="account-gate account-required">
        <div className="account-gate-layout">
          <aside className="account-gate-showcase">
            <div className="account-gate-showcase-brand">
              <span className="account-gate-mark" aria-hidden="true">Z</span>
              <span>ZERODHA</span>
            </div>

            <div className="account-gate-showcase-copy">
              <span className="account-gate-showcase-eyebrow">YOUR MONEY. YOUR VIEW.</span>
              <h1>A clearer view of your trading account.</h1>
              <p>
                Keep your holdings, positions, orders and demo balance together
                in one private workspace.
              </p>
            </div>

            <div className="account-gate-preview" aria-label="Dashboard preview">
              <div className="account-gate-preview-heading">
                <span>Portfolio overview</span>
                <span className="account-gate-preview-badge">PREVIEW</span>
              </div>
              <div className="account-gate-preview-value">
                <span>Account activity</span>
                <div className="account-gate-preview-chart" aria-hidden="true">
                  <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
                </div>
              </div>
              <div className="account-gate-preview-footer">
                <span><b className="preview-dot holdings-dot" /> Holdings</span>
                <span><b className="preview-dot orders-dot" /> Orders</span>
                <span><b className="preview-dot funds-dot" /> Funds</span>
              </div>
            </div>

            <p className="account-gate-showcase-note">
              Demo workspace · No real trades or payments
            </p>
          </aside>

          <section className="account-gate-card" aria-labelledby="account-gate-title">
            <div className="account-gate-content">
              <div className="account-gate-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3.5 19 6v5.3c0 4.4-2.8 7.7-7 9.2-4.2-1.5-7-4.8-7-9.2V6l7-2.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 12.2 11.2 14l3.6-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="account-gate-eyebrow">PRIVATE ACCOUNT ACCESS</span>
              <h2 id="account-gate-title">Sign in to continue</h2>
              <p className="account-gate-description">
                Sign in to securely open your personal dashboard.
              </p>

              {sessionError && (
                <div className="account-gate-error" role="alert">
                  <span className="account-gate-error-dot" aria-hidden="true" />
                  {sessionError}
                </div>
              )}

              <div className="account-gate-actions">
                <a className="account-gate-primary" href={`${frontendUrl}/login`}>
                  Sign in <span aria-hidden="true">→</span>
                </a>
                <a className="account-gate-secondary" href={`${frontendUrl}/signup`}>
                  Create an account
                </a>
              </div>

              <a className="account-gate-back" href={frontendUrl || "/"}>
                <span aria-hidden="true">←</span> Back to Zerodha website
              </a>
            </div>

            <footer className="account-gate-footer">
              <span>Secure account access</span>
              <span className="account-gate-footer-dot" aria-hidden="true">·</span>
              <span>Demo mode</span>
            </footer>
          </section>
        </div>
      </main>
    );
  }

  return (
    <>
      {sessionError && <p role="alert">{sessionError}</p>}
      <TopBar user={user} onLogout={handleLogout} />
      <Dashboard user={user} />
    </>
  );
};

export default Home;
