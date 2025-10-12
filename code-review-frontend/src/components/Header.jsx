import React from 'react';
import { SignInButton, useUser, UserButton } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";
import './Header.css'; // Import the new stylesheet

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="app-header">
      <Link to="/" className="logo-link">
        <h1>CodeReview AI</h1>
      </Link>
      <nav className="header-nav">
        {isSignedIn ? (
          <div className="nav-links">
            {/* Using NavLink adds a special 'active' class for the current page */}
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <SignInButton mode="modal">
            {/* Apply the .btn class to your custom button */}
            <button className="btn">
              Sign In
            </button>
          </SignInButton>
        )}
      </nav>
    </header>
  );
}