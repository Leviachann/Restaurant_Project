import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../css/App.css";
import games from "../data/games";
import FlashGame from "./FlashGame";

function GameZone() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); 

  const handleGoBack = () => {
    setSelectedGame(null);
  };

  const handleGoToSecondHall = () => {
    navigate("/secondhall");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="game-zone"
      style={{
        backgroundImage: isLoading
          ? "url('/images/gamein.gif')"
          : "url('/images/gamezone.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isLoading && <div className="loading-overlay"></div>}

      {!selectedGame && !isLoading && (
        <>
          <button className="go-back-button bb" onClick={handleGoToSecondHall}>
            Go Back
          </button>

          <div className="game-gallery">
            {games.map((game, index) => (
              <div
                key={index}
                className="game-icon-container"
                onClick={() => setSelectedGame(game)}
              >
                <img src={game.icon} alt={game.name} className="game-icon" />
                <div className="game-title">{game.name}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedGame && (
        <div className="game-display">
          <button className="go-back-button" onClick={handleGoBack}>
            Go Back
          </button>
          {selectedGame.type === "flash" ? (
            <FlashGame gameUrl={selectedGame.url} />
          ) : (
            <iframe
              title={selectedGame.name}
              src={selectedGame.url}
              width="800"
              height="600"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
}

export default GameZone;