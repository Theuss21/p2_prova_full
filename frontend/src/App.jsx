import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import VehiclesPage from './pages/VehiclesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface">
        <Navbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedLayout>
              <DashboardPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedLayout>
              <UsersPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/veiculos"
          element={
            <ProtectedLayout>
              <VehiclesPage />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </>
  );
}
