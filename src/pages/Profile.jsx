/**
 * Profile Page
 * User profile page (placeholder)
 */

import React from 'react';

/**
 * Profile page component
 */
const Profile = () => {
  return (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Profile</h1>
      <p style={{ color: '#666', fontSize: '18px', maxWidth: '600px' }}>
        This feature is coming soon! Manage your profile and preferences here.
      </p>
      <div
        style={{
          marginTop: '40px',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          maxWidth: '500px',
        }}
      >
        <h3 style={{ color: '#333', marginBottom: '15px' }}>
          Planned Features
        </h3>
        <ul
          style={{
            textAlign: 'left',
            color: '#666',
            lineHeight: '1.8',
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li>✓ User authentication</li>
          <li>✓ Profile settings</li>
          <li>✓ Design history</li>
          <li>✓ Account preferences</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;

