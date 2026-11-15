import React from "react";
import { Link } from "react-router-dom";
import {
  AccountBalanceWalletOutlined,
  AssessmentOutlined,
  ReceiptLongOutlined,
  ShowChartOutlined,
  TravelExploreOutlined,
} from "@mui/icons-material";
import "./Apps.css";

const appLinks = [
  {
    title: "Portfolio",
    description: "Review your holdings, market value, and portfolio P&L.",
    to: "/holdings",
    icon: AssessmentOutlined,
    action: "View holdings",
  },
  {
    title: "Positions",
    description: "Track your open demo intraday positions.",
    to: "/positions",
    icon: ShowChartOutlined,
    action: "View positions",
  },
  {
    title: "Orders",
    description: "See your saved buy and sell order history.",
    to: "/orders",
    icon: ReceiptLongOutlined,
    action: "View orders",
  },
  {
    title: "Funds",
    description: "Manage your virtual balance and review transactions.",
    to: "/funds",
    icon: AccountBalanceWalletOutlined,
    action: "Manage funds",
  },
];

const Apps = () => (
  <section className="apps-page">
    <header className="apps-page-header">
      <div>
        <h1>Apps &amp; shortcuts</h1>
        <p>Quick access to your demo trading workspace.</p>
      </div>
    </header>

    <div className="apps-grid">
      {appLinks.map(({ title, description, to, icon: Icon, action }) => (
        <article className="app-card" key={to}>
          <span className="app-card-icon">
            <Icon aria-hidden="true" />
          </span>
          <h2>{title}</h2>
          <p>{description}</p>
          <Link to={to}>
            {action}
            <span aria-hidden="true"> →</span>
          </Link>
        </article>
      ))}
      <article className="app-card app-card-info">
        <span className="app-card-icon">
          <TravelExploreOutlined aria-hidden="true" />
        </span>
        <h2>Demo mode</h2>
        <p>
          Orders, positions, and balances are simulated for this account. No
          broker or payment provider is connected.
        </p>
        <span className="app-card-label">Paper trading</span>
      </article>
    </div>
  </section>
);

export default Apps;
