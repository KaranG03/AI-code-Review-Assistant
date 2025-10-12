// src/App.jsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import HomePage from './Pages/HomePage';
import DashboardPage from './Pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* 任何人都可以访问这个公共页面 */}
      <Route path="/" element={<HomePage />} />

      {/* ✅ This is the protected route */}
      <Route
        path="/dashboard"
        element={
          <>
            {/* If the user is signed in, show the dashboard */}
            <SignedIn>
              <DashboardPage />
            </SignedIn>
            {/* If the user is signed out, redirect them to the sign-in page */}
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}

export default App;