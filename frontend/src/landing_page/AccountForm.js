import React, { useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api";
import "./AccountForm.css";

const AccountForm = ({ mode }) => {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiClient.post(
        isRegister ? "/auth/register" : "/auth/login",
        isRegister ? { name, email, password } : { email, password }
      );
      window.location.assign(
        process.env.REACT_APP_DASHBOARD_URL ||
          (process.env.NODE_ENV === "production"
            ? "/dashboard"
            : "http://localhost:3001")
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to connect. Check that the backend is running and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="account-form-section">
      <form className="account-form" onSubmit={handleSubmit}>
        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p>
          {isRegister
            ? "Create an account to access your private trading dashboard."
            : "Sign in to view your account and trading dashboard."}
        </p>
        {isRegister && (
          <label>
            Full name
            <input
              autoComplete="name"
              maxLength="80"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            maxLength="254"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength="8"
            maxLength="128"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {isRegister && (
            <small>Use at least 8 characters.</small>
          )}
        </label>
        {error && <p className="account-form-error" role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : isRegister
              ? "Create account"
              : "Sign in"}
        </button>
        <p className="account-form-switch">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <Link to={isRegister ? "/login" : "/signup"}>
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </form>
    </section>
  );
};

export default AccountForm;
