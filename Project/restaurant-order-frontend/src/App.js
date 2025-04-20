import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import SecondHall from "./components/SecondHall";
import FoodZone from "./components/FoodZone";
import GameZone from "./components/GameZone";
import OrderQueue from "./components/Monitoring/OrderQueue";
import CustomerOrderMonitor from "./components/Monitoring/CustomerOrderMonitor";
import "./css/App.css";

function App() {
  const [background, setBackground] = useState("/images/default.gif");
  const [fadeOut, setFadeOut] = useState(false);

  const handleOpenTap = () => {
    setFadeOut(false);
    setBackground("/images/open.gif");

    setTimeout(() => {
      setFadeOut(true);
    }, 11000);

    setTimeout(() => {
      window.location.href = "/secondhall";
    }, 15000);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<WelcomePage handleOpenTap={handleOpenTap} background={background} fadeOut={fadeOut} />}
        />
        <Route
          path="/secondhall"
          element={<SecondHall />}
        />
        <Route
          path="/foodzone/*"
          element={<FoodZone />}
        />
        <Route
          path="/gamezone"
          element={<GameZone />}
        />
        
        <Route
          path="/orderqueue"
          element={<OrderQueue />}
        />
        <Route
          path="/ordermonitor"
          element={<CustomerOrderMonitor />}
        />
      </Routes>
    </Router>
  );
}

export default App;