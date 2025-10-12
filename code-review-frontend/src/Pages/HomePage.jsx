import React from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import Header from '../components/Header';
import './HomePage.css'; // Import the new stylesheet

function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <div className="homepage">
      <Header />
      <main className="hero-section">
        <h1 className="hero-title">Welcome to the Future of Code Reviews</h1>
        <p className="hero-subtitle">
          Upload your code, and our AI will provide instant feedback, suggestions for improvement, and corrections.
        </p>
        
        {/* Conditionally render the Sign In button */}
        {!isSignedIn && (
          <div className="hero-cta">
            <SignInButton mode="modal">
              <button className="btn">
                Sign In to Get Started
              </button>
            </SignInButton>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;