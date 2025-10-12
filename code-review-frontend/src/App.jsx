// src/App.jsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import HomePage from './Pages/HomePage';
import DashboardPage from './Pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* */}
      <Route path="/" element={<HomePage />} />

      {/* protected route */}
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
