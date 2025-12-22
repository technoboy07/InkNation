/**
 * Navbar Component
 * Navigation bar with routing links
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';
import { config } from '../config/env';

/**
 * Navbar component
 */
const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    padding: '10px 20px',
    textDecoration: 'none',
    color: isActive(path) ? '#3498db' : '#333',
    borderBottom: isActive(path) ? '2px solid #3498db' : '2px solid transparent',
    transition: 'all 0.3s ease',
    fontWeight: isActive(path) ? '600' : '400',
  });

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Link
        to={ROUTES.HOME}
        style={{
          textDecoration: 'none',
          color: '#333',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        {config.appName}
      </Link>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={ROUTES.CREATE_NEW} style={linkStyle(ROUTES.CREATE_NEW)}>
          Create New
        </Link>
        <Link to={ROUTES.YOUR_DESIGNS} style={linkStyle(ROUTES.YOUR_DESIGNS)}>
          Your Designs
        </Link>
        <Link to={ROUTES.PROFILE} style={linkStyle(ROUTES.PROFILE)}>
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

