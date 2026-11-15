import React from "react";
import { VerticalGraph } from "./VerticalGraph";
import useApiData from "../useApiData";

const Holdings = () => {
  const {
    data: allHoldings,
    isLoading,
    error,
  } = useApiData("/allHoldings");

  const totalInvestment = allHoldings.reduce(
    (total, stock) => total + (Number(stock.avg) || 0) * (Number(stock.qty) || 0),
    0
  );
  const currentValue = allHoldings.reduce(
    (total, stock) => total + (Number(stock.price) || 0) * (Number(stock.qty) || 0),
    0
  );
  const profitLoss = currentValue - totalInvestment;
  const profitLossPercentage =
    totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;
  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
  const formatCurrency = (amount) => currencyFormatter.format(amount);
  const labels = allHoldings.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      {isLoading && <p role="status">Loading holdings...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && allHoldings.length === 0 && (
        <p className="holdings-empty">
          You do not have delivery holdings yet. Place a CNC buy order to get started.
        </p>
      )}

      {allHoldings.length > 0 && <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock) => {
              const quantity = Number(stock.qty) || 0;
              const averagePrice = Number(stock.avg) || 0;
              const price = Number(stock.price) || 0;
              const stockValue = price * quantity;
              const stockProfitLoss = stockValue - averagePrice * quantity;
              const profitClass = stockProfitLoss >= 0 ? "profit" : "loss";
              const dayClass = String(stock.day || "").trim().startsWith("-")
                ? "loss"
                : "profit";

              return (
                <tr key={stock._id || stock.name}>
                  <td>{stock.name}</td>
                  <td>{quantity}</td>
                  <td>{formatCurrency(averagePrice)}</td>
                  <td>{formatCurrency(price)}</td>
                  <td>{formatCurrency(stockValue)}</td>
                  <td className={profitClass}>{formatCurrency(stockProfitLoss)}</td>
                  <td className={profitClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>}

      <div className="row">
        <div className="col">
          <h5>{formatCurrency(totalInvestment)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>{formatCurrency(currentValue)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={profitLoss >= 0 ? "profit" : "loss"}>
            {formatCurrency(profitLoss)} ({profitLossPercentage.toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      {allHoldings.length > 0 && <VerticalGraph data={data} />}
    </>
  );
};

export default Holdings;
