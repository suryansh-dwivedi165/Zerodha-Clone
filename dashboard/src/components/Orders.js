import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApiData from "../useApiData";

const Orders = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: orders, isLoading, error } = useApiData("/allOrders", refreshKey);

  useEffect(() => {
    const refreshOrders = () => setRefreshKey((key) => key + 1);
    window.addEventListener("order-created", refreshOrders);
    return () => window.removeEventListener("order-created", refreshOrders);
  }, []);

  return (
    <div className="orders">
      <h3 className="title">Orders ({orders.length})</h3>
      {isLoading && <p role="status">Loading orders...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && orders.length === 0 && (
        <div className="no-orders">
          <p>You haven't placed any orders yet</p>
          <Link to={"/"} className="btn">Get started</Link>
        </div>
      )}
      {!error && orders.length > 0 && (
        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Product</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Mode</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.name}</td>
                  <td>{order.product || "CNC"}</td>
                  <td>{order.qty}</td>
                  <td>{Number(order.price).toFixed(2)}</td>
                  <td className={order.mode === "BUY" ? "profit" : "loss"}>
                    {order.mode}
                  </td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
