import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api";
import "./Navbar.css";

function Navbar() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");
  const [user, setUser] = useState(null);
  const [logoutError, setLogoutError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const checkBackend = async () => {
      try {
        const response = await apiClient.get("/health", {
          signal: controller.signal,
        });
        setBackendStatus(
          response.data.status === "ok"
            ? "Backend connected"
            : "Backend unavailable",
        );
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setBackendStatus("Backend unavailable");
        }
      }

      try {
        const response = await apiClient.get("/auth/me", {
          signal: controller.signal,
        });
        setUser(response.data.user);
      } catch (error) {
        if (error.code !== "ERR_CANCELED" && error.response?.status !== 401) {
          setBackendStatus("Backend unavailable");
        }
      }
    };

    checkBackend();

    return () => controller.abort();
  }, []);

  const dashboardUrl =
    process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001/dashboard";

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
      setIsMenuOpen(false);
    } catch (error) {
      setLogoutError(
        error.response?.data?.message ||
          "Unable to sign out. Please try again.",
      );
    }
  };

  return (
    <nav className="site-navbar" aria-label="Main navigation">
      <div className="site-navbar-inner">
        <Link
          className="site-navbar-brand"
          to="/"
          aria-label="Zerodha home"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src="/media/images/logo.svg" alt="Zerodha" />
        </Link>

        <button
          className="site-navbar-toggle"
          type="button"
          aria-controls="site-navbar-links"
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`site-navbar-content${isMenuOpen ? " is-open" : ""}`}
          id="site-navbar-links"
        >
          <ul className="site-navbar-links">
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/product" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/support" onClick={() => setIsMenuOpen(false)}>
                Support
              </Link>
            </li>
            <li>
              <a href={dashboardUrl} onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </a>
            </li>
          </ul>

          <div className="site-navbar-account">
            <span
              className={`backend-status ${
                backendStatus === "Backend connected" ? "is-connected" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              <span className="backend-status-dot" aria-hidden="true" />
            </span>
            {user ? (
              <>
                <span className="site-navbar-user" title={user.email}>
                  {user.name}
                </span>
                <button
                  type="button"
                  className="site-navbar-signout"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  className="site-navbar-signin"
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  className="site-navbar-signup"
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
        {logoutError && (
          <span className="site-navbar-error" role="alert">
            {logoutError}
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
