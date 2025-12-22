/**
 * App Component
 * Main application component with routing
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import CreateNew from './pages/CreateNew';
import YourDesigns from './pages/YourDesigns';
import Profile from './pages/Profile';
import { ROUTES } from './constants';
import './App.css';

/**
 * App component
 */
const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 60px)' }}>
            <Routes>
              <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.CREATE_NEW} replace />} />
              <Route path={ROUTES.CREATE_NEW} element={<CreateNew />} />
              <Route path={ROUTES.YOUR_DESIGNS} element={<YourDesigns />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path="*" element={<Navigate to={ROUTES.CREATE_NEW} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;

