/**
 * LoadingSpinner Component
 * Displays a loading indicator
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingSpinner component
 * @param {string} message - Optional loading message
 * @param {string} size - Size of the spinner ('small', 'medium', 'large')
 */
const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px',
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `4px solid #f3f3f3`,
          borderTop: `4px solid #3498db`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {message && (
        <p style={{ marginTop: '20px', color: '#666' }}>{message}</p>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default LoadingSpinner;

