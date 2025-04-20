import { useState } from "react";

export const useFade = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const triggerFadeOut = (callback, delay = 0) => {
    setFadeOut(true);
    setTimeout(() => {
      if (callback) callback();
      setFadeOut(false);
    }, delay);
  };

  const triggerFadeIn = (delay = 0) => {
    setTimeout(() => {
      setFadeIn(true);
    }, delay);
  };

  return { fadeOut, fadeIn, triggerFadeOut, triggerFadeIn };
};
