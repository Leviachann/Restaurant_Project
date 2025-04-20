import React from "react";
import "../../css/App.css";

function PageLayout({ leftContent, rightContent, navigateToFoodZone, navigateToOrderMonitor }) {
  return (
    <div className="page-layout">
      <div className="content">
        <div className="left-content">
          {leftContent}
        </div>
        <div className="right-content">
          <button
            className="nav-button left"
            onClick={navigateToFoodZone}
          >
            X
          </button>
          {rightContent}
          <button
            className="nav-button right"
            onClick={navigateToOrderMonitor}
          >
            Y
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageLayout;