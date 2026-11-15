import React, { useState } from "react";
import apiClient from "../api";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ name, price, mode, onClose }) => {
  const [quantity, setQuantity] = useState("1");
  const [orderPrice, setOrderPrice] = useState(String(price));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isBuy = mode === "BUY";
  const [product, setProduct] = useState("CNC");
  const total = (Number(quantity) || 0) * (Number(orderPrice) || 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(orderPrice);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError("Enter a whole-number quantity greater than zero.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Enter a price greater than zero.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/newOrder", {
        name,
        qty: parsedQuantity,
        price: parsedPrice,
        mode,
        product,
      });
      window.dispatchEvent(
        new CustomEvent("order-created", { detail: response.data })
      );
      onClose();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not save your order. Check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="order-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <form
        className="order-dialog"
        onSubmit={handleSubmit}
        aria-labelledby="order-dialog-title"
      >
        <div className={`order-dialog-header ${isBuy ? "buy" : "sell"}`}>
          <div>
            <p>{isBuy ? "Buy order" : "Sell order"}</p>
            <h2 id="order-dialog-title">{name}</h2>
          </div>
          <button
            type="button"
            className="order-dialog-close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close order form"
          >
            ×
          </button>
        </div>

        <div className="order-dialog-fields">
          <label>
            Product
            <select
              name="product"
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              disabled={isSubmitting}
            >
              <option value="CNC">CNC · Delivery</option>
              <option value="MIS">MIS · Intraday</option>
            </select>
          </label>
          <label>
            Quantity
            <input
              type="number"
              name="quantity"
              min="1"
              step="1"
              required
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              disabled={isSubmitting}
            />
          </label>
          <label>
            Price (₹)
            <input
              type="number"
              name="price"
              min="0.01"
              step="0.01"
              required
              value={orderPrice}
              onChange={(event) => setOrderPrice(event.target.value)}
              disabled={isSubmitting}
            />
          </label>
        </div>

        <div className="order-dialog-total">
          <span>Estimated order value</span>
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 2,
            }).format(total)}
          </strong>
        </div>

        {error && <p className="order-dialog-error" role="alert">{error}</p>}

        <div className="order-dialog-actions">
          <button
            type="button"
            className="order-dialog-cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`order-dialog-submit ${isBuy ? "buy" : "sell"}`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : `Place ${isBuy ? "buy" : "sell"} order`}
          </button>
        </div>
        <p className="order-dialog-note">
          This saves an order record; it does not execute a real market trade.
        </p>
      </form>
    </div>
  );
};

export default BuyActionWindow;
