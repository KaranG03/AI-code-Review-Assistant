import React from 'react';
import './AdvancedLoader.css'; // We will create this CSS file next

const CheckmarkIcon = () => (
  <svg className="checkmark-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
  </svg>
);

const LoaderSpinner = () => <div className="loader-spinner"></div>;

const PendingIcon = () => <div className="pending-icon"></div>;

export default function AdvancedLoader({ steps, currentStep }) {
  return (
    <div className="advanced-loader-backdrop">
      <div className="loader-box">
        <div className="loader-header">
          <h3>Analyzing Your Code</h3>
          <p>Our AI is hard at work. This may take a moment.</p>
        </div>
        <ul className="loader-steps">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            
            let icon;
            if (isCompleted) {
              icon = <CheckmarkIcon />;
            } else if (isActive) {
              icon = <LoaderSpinner />;
            } else {
              icon = <PendingIcon />;
            }

            let statusClass = '';
            if (isCompleted) statusClass = 'step-completed';
            if (isActive) statusClass = 'step-active';

            return (
              <li key={index} className={`loader-step ${statusClass}`}>
                <div className="step-icon">{icon}</div>
                <span className="step-text">{step}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}