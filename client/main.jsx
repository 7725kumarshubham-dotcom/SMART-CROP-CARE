import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthScreen from "./AuthScreen.jsx";
import DashboardClient from "./DashboardClient.jsx";
import "./globals.css";

function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadSession() {
    const response = await fetch("/api/auth/me");
    if (!response.ok) {
      setAccount(null);
      return null;
    }
    const result = await response.json();
    const nextAccount = result?.account || null;
    setAccount(nextAccount);
    return nextAccount;
  }

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then(async (response) => (response.ok ? response.json() : null))
      .then((result) => {
        if (active) setAccount(result?.account || null);
      })
      .catch(() => {
        if (active) setAccount(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7f2]">
        <p className="text-sm font-semibold text-[#246b45]">Loading Smart Crop Care...</p>
      </main>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            account
              ? <Navigate to="/dashboard" replace />
              : <AuthScreen onAuthenticated={loadSession} />
          }
        />
        <Route
          path="/dashboard"
          element={
            account
              ? (
                  <DashboardClient
                    account={account}
                    onSignedOut={() => setAccount(null)}
                  />
                )
              : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to={account ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
