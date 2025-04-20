import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId="858901512656-4rdnjuft3it0lko3kgtf3394fee4jhvt.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
reportWebVitals();
