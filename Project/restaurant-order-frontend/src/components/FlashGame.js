import { useEffect, useRef } from "react";
import React from "react";

const FlashGame = ({ gameUrl }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!gameUrl) {
      console.error("No game URL provided");
      return;
    }

    console.log("Loading Ruffle...");
    
    let script;
    let player;
    const currentRef = ref.current; 

    if (!window.RufflePlayer) {
      console.log("Ruffle script not found. Loading script...");
      script = document.createElement("script");
      script.src = "https://unpkg.com/@ruffle-rs/ruffle";
      script.async = true;
      script.onload = () => {
        console.log("Ruffle script loaded. Initializing game...");
        player = initializeRuffle(gameUrl, currentRef);
      };
      document.body.appendChild(script);
    } else {
      console.log("Ruffle already loaded. Initializing game...");
      player = initializeRuffle(gameUrl, currentRef);
    }

    return () => {
      console.log("Cleaning up Flash game...");
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (player && currentRef && currentRef.contains(player)) {
        currentRef.removeChild(player);
      }
      if (currentRef) {
        currentRef.innerHTML = "";
      }
    };
  }, [gameUrl]);

  const initializeRuffle = (url, container) => {
    const ruffle = window.RufflePlayer?.newest();
    if (ruffle && container) {
      console.log("Ruffle initialized. Loading game:", url);
      const player = ruffle.createPlayer();
      container.appendChild(player);
      player.load(url);
      return player;
    } else {
      console.error("Ruffle failed to load or container not available.");
      return null;
    }
  };

  return <div ref={ref}></div>;
};

export default FlashGame;