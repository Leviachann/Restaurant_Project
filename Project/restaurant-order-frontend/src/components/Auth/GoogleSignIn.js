import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../../css/App.css';

function GoogleSignIn({ onSuccess, onError }) {
  return (
    <div className="google-signin-container">
      <div className="auth-card">
        <h2 className="auth-title">Admin Portal</h2>
        <p className="auth-subtitle">Please sign in to manage orders</p>
        <div className="google-button-wrapper">
          <GoogleLogin
            onSuccess={credentialResponse => {
              const decoded = jwtDecode(credentialResponse.credential);
              onSuccess(decoded);
            }}
            onError={() => {
              console.log('Login Failed');
              onError();
            }}
            useOneTap
            auto_select
            theme="filled_black" 
            shape="pill" 
            size="large" 
            text="continue_with" 
            logo_alignment="left"
          />
        </div>
      </div>
    </div>
  );
}

export default GoogleSignIn;