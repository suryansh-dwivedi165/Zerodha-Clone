import React from "react";

const quickLinks = [
  "Account opening",
  "Funds",
  "Trading and orders",
  "Your account",
];

const Hero = ({ search, onSearchChange }) => (
  <section className="support-hero">
    <div className="support-hero-inner">
      <div className="support-hero-topline">
        <div>
          <span className="support-eyebrow">ZERODHA SUPPORT</span>
          <h1>How can we help?</h1>
        </div>
        <a className="support-track-link" href="#help-topics">
          Browse help topics <span aria-hidden="true">→</span>
        </a>
      </div>

      <p className="support-hero-description">
        Search for an answer or browse topics to find the support you need.
      </p>

      <label className="support-search">
        <span className="support-search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Try “withdraw funds” or “reset password”"
          aria-label="Search help topics"
        />
        <kbd>Search</kbd>
      </label>

      <div className="support-quick-links" aria-label="Popular topics">
        <span>Popular:</span>
        {quickLinks.map((topic) => (
          <button
            type="button"
            key={topic}
            onClick={() => onSearchChange(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;
