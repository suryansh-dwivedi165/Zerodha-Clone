import React from "react";
import useApiData from "../useApiData";

const Positions = () => {
  const { data: positions, isLoading, error } = useApiData("/allPositions");

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>
      {isLoading && <p role="status">Loading positions...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && positions.length === 0 && (
        <p className="positions-empty">
          No open intraday positions. Choose MIS when placing a demo order.
        </p>
      )}

      {positions.length > 0 && <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&amp;L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((stock) => {
              const quantity = Number(stock.qty) || 0;
              const averagePrice = Number(stock.avg) || 0;
              const price = Number(stock.price) || 0;
              const currentValue = price * quantity;
              const profitLoss = currentValue - averagePrice * quantity;
              const profitClass = profitLoss >= 0 ? "profit" : "loss";
              const dayClass = String(stock.day || "").trim().startsWith("-")
                ? "loss"
                : "profit";

              return (
                <tr key={stock._id || `${stock.product}-${stock.name}`}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{quantity}</td>
                  <td>{averagePrice.toFixed(2)}</td>
                  <td>{price.toFixed(2)}</td>
                  <td className={profitClass}>{profitLoss.toFixed(2)}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>}
    </>
  );
};

export default Positions;
