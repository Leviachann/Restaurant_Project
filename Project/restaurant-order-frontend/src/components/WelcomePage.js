import React from "react";
import "../css/App.css";

function WelcomePage({ handleOpenTap, background, fadeOut }) {
  return (
    <div
      className={`welcome-page ${fadeOut ? "fade-out" : ""}`}
      style={{ backgroundImage: `url(${background})` }}
      onClick={handleOpenTap}
    >
    </div>
  );
}

export default WelcomePage;