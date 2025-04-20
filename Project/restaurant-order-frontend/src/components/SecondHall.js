import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/App.css";

function SecondHall() {
  const [background, setBackground] = useState("/images/doubledefault.gif");
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  const handleGoBack = () => {
    setFadeOut(false);
    setBackground("/images/gobackmain.gif");

    setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    setTimeout(() => {
      navigate("/");
      setFadeIn(true);
    }, 3000);
  };

  const handleZone = (zone) => {
    const zoneGif = zone === "game" ? "/images/gamezone.gif" : "/images/foodzone.gif";
    setFadeOut(false);
    setBackground(zoneGif);

    setTimeout(() => {
      setFadeOut(true);
    }, 1800);

    setTimeout(() => {
      navigate(`/${zone}zone`);
      setFadeIn(true);
    }, 3000);
  };

  return (
    <div
      className={`second-hall ${fadeOut ? "fade-out" : fadeIn ? "fade-in" : ""}`}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="zone-button" onClick={() => handleZone("game")}></div>
      <div className="zone-button" onClick={handleGoBack}></div>
      <div className="zone-button" onClick={() => handleZone("food")}></div>
    </div>
  );
}

export default SecondHall;