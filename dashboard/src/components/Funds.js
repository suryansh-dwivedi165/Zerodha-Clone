import React, { useCallback, useEffect, useState } from "react";
import apiClient from "../api";
import "./Funds.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

const Funds = () => {
  const [funds, setFunds] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFunds = useCallback(async (signal) => {
    try {
      setLoadError("");
      const response = await apiClient.get("/funds", { signal });
      setFunds(response.data);
    } catch (error) {
      if (error.code !== "ERR_CANCELED") {
        setLoadError(
          error.response?.data?.message ||
            "Unable to load funds. Check the backend connection and try again."
        );
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadFunds(controller.signal);
    return () => controller.abort();
  }, [loadFunds]);

  const openTransaction = (type) => {
    setTransactionType(type);
    setAmount("");
    setTransactionError("");
  };

  const handleTransaction = async (event) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setTransactionError("Enter an amount greater than zero.");
      return;
    }

    setIsSubmitting(true);
    setTransactionError("");
    try {
      await apiClient.post(`/funds/${transactionType}`, { amount: value });
      setTransactionType("");
      const controller = new AbortController();
      await loadFunds(controller.signal);
    } catch (error) {
      setTransactionError(
        error.response?.data?.message || "Unable to update demo funds. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="funds-page">
      <header className="funds-page-header">
        <div>
          <h1>Funds</h1>
          <p>Manage your virtual balance for demo trades.</p>
        </div>
        <div className="funds-page-actions">
          <button type="button" className="funds-add-button" onClick={() => openTransaction("deposit")}>
            Add virtual funds
          </button>
          <button type="button" className="funds-withdraw-button" onClick={() => openTransaction("withdraw")}>
            Withdraw
          </button>
        </div>
      </header>

      <p className="funds-demo-notice">
        Demo account only. These actions change virtual funds and do not move real money.
      </p>

      {isLoading && <p role="status">Loading funds...</p>}
      {loadError && <p className="funds-error" role="alert">{loadError}</p>}

      {transactionType && (
        <form className="funds-transaction-form" onSubmit={handleTransaction}>
          <label htmlFor="funds-amount">
            {transactionType === "deposit" ? "Add virtual funds" : "Withdraw virtual funds"} (₹)
          </label>
          <input
            id="funds-amount"
            type="number"
            min="0.01"
            max="10000000"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            disabled={isSubmitting}
          />
          {transactionError && <p className="funds-error" role="alert">{transactionError}</p>}
          <div className="funds-form-actions">
            <button type="button" onClick={() => setTransactionType("")} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      )}

      {funds && (
        <>
          <div className="funds-balance-card">
            <span>Available demo balance</span>
            <strong>{formatCurrency(funds.cashBalance)}</strong>
            <small>Opening balance: {formatCurrency(funds.openingBalance)}</small>
          </div>

          <section className="funds-ledger">
            <h2>Recent transactions</h2>
            {funds.fundsTransactions.length === 0 ? (
              <p className="funds-empty">No fund transactions yet.</p>
            ) : (
              <div className="order-table">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funds.fundsTransactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>{transaction.type === "PAYIN" ? "Added" : "Withdrawn"}</td>
                        <td className={transaction.type === "PAYIN" ? "profit" : "loss"}>
                          {transaction.type === "PAYIN" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
};

export default Funds;
