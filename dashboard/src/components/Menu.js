import React from "react";
import { NavLink } from "react-router-dom";
import { LogoutOutlined } from "@mui/icons-material";
import "./Menu.css";

const navigationItems = [
  { label: "Overview", to: "/", end: true },
  { label: "Orders", to: "/orders" },
  { label: "Holdings", to: "/holdings" },
  { label: "Positions", to: "/positions" },
  { label: "Funds", to: "/funds" },
  { label: "Apps", to: "/apps" },
];

const Menu = ({ user, onLogout }) => {
  const configuredHomeUrl =
    process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";
  const homeUrl =
    configuredHomeUrl === "/" ? "/" : configuredHomeUrl.replace(/\/$/, "");
  const initials = (user?.name || "User")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="menu-container trading-menu">
      <a
        className="trading-menu-brand"
        href={homeUrl}
        aria-label="Go to Zerodha home page"
        title="Zerodha home"
      >
        <span className="trading-menu-brand-mark" aria-hidden="true">
          Z
        </span>
      </a>

      <nav className="menus trading-menu-navigation" aria-label="Dashboard">
        <ul>
          {navigationItems.map(({ label, to, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                title={label}
                aria-label={label}
                className={({ isActive }) =>
                  `trading-menu-link${isActive ? " is-active" : ""}`
                }
              >
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="trading-menu-account">
        <div className="trading-menu-user" title={user?.email}>
          <span className="trading-menu-avatar" aria-hidden="true">
            {initials}
          </span>
        </div>
        <button
          type="button"
          className="trading-menu-logout"
          onClick={onLogout}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogoutOutlined aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;
