import React from "react";
import "./LeftSection.css";

function LeftSection() {
  return (
    <div className="left-section">
      <h2 className="section-heading">
        Steps to open a demat account with Zerodha
      </h2>
    {/* "media/images/Photo.svg" */}
      <div className="main-content">
        <div className="image-container">
          <img src="/media/Images/Photo.svg" alt="Demat account" />
        </div>
        <div className="steps-container">
          <div className="step">
            <span className="step-number">01</span>
            <p>Enter the requested details</p>
          </div>

          <div className="step">
            <span className="step-number">02</span>
            <p>Complete e-sign & verification</p>
          </div>

          <div className="step last-step">
            <span className="step-number">03</span>
            <p>Start investing!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
