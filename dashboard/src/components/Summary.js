import React, { useEffect, useState } from "react";
import apiClient from "../api";
import useApiData from "../useApiData";
import "./Summary.css";

const Summary = ({ user }) => {
  const { data: holdings, isLoading, error } = useApiData("/allHoldings");
  const [funds, setFunds] = useState(null);
  const [fundsError, setFundsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .get("/funds", { signal: controller.signal })
      .then((response) => setFunds(response.data))
      .catch((requestError) => {
        if (requestError.code !== "ERR_CANCELED") {
          setFundsError(
            requestError.response?.data?.message || "Unable to load account funds"
          );
        }
      });

    return () => controller.abort();
  }, []);
  const totalInvestment = holdings.reduce(
    (total, holding) =>
      total + (Number(holding.avg) || 0) * (Number(holding.qty) || 0),
    0
  );
  const currentValue = holdings.reduce(
    (total, holding) =>
      total + (Number(holding.price) || 0) * (Number(holding.qty) || 0),
    0
  );
  const profitLoss = currentValue - totalInvestment;
  const profitLossPercentage =
    totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <main className="account-overview">
      <header className="overview-heading">
        <p>ACCOUNT OVERVIEW</p>
        <h1>Welcome back, {user.name}</h1>
        <span>Your portfolio and available demo funds at a glance.</span>
      </header>

      <div className="overview-cards">
        <section className="overview-card" aria-labelledby="equity-card-title">
          <div className="overview-card-heading">
            <h2 id="equity-card-title">Equity</h2>
            <span className="overview-card-tag">DEMO ACCOUNT</span>
          </div>
          <div className="overview-primary-value">
            <span>Margin available</span>
            <strong>
              {funds
                ? formatCurrency(funds.cashBalance)
                : fundsError
                  ? "Unavailable"
                  : "Loading..."}
            </strong>
          </div>
          <div className="overview-card-details">
            <div>
              <span>Opening balance</span>
              <strong>
                {funds ? formatCurrency(funds.openingBalance) : "Loading..."}
              </strong>
            </div>
            <div>
              <span>Margins used</span>
              <strong>{formatCurrency(0)}</strong>
            </div>
          </div>
        </section>

        <section className="overview-card" aria-labelledby="holdings-card-title">
          <div className="overview-card-heading">
            <h2 id="holdings-card-title">Holdings</h2>
            <span className="overview-card-tag">{holdings.length} ASSETS</span>
          </div>
          <div className="overview-primary-value">
            <span>Total P&amp;L</span>
            <strong className={profitLoss >= 0 ? "profit" : "loss"}>
              {isLoading ? "Loading..." : formatCurrency(profitLoss)}
              {!isLoading && (
                <small>
                  {profitLoss >= 0 ? "+" : ""}
                  {profitLossPercentage.toFixed(2)}%
                </small>
              )}
            </strong>
          </div>
          <div className="overview-card-details">
            <div>
              <span>Current value</span>
              <strong>
                {isLoading ? "Loading..." : formatCurrency(currentValue)}
              </strong>
            </div>
            <div>
              <span>Investment</span>
              <strong>
                {isLoading ? "Loading..." : formatCurrency(totalInvestment)}
              </strong>
            </div>
          </div>
        </section>
      </div>

      {(error || fundsError) && (
        <p className="overview-error" role="alert">
          {error || fundsError}
        </p>
      )}
    </main>
  );
};

export default Summary;
