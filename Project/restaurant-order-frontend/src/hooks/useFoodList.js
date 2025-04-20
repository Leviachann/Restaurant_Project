import { useState, useEffect } from "react";
import { sanitizeFoodData } from "../utils/sanitizeFoodData";

export function useFoodList() {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7183/api/food")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFoodList(sanitizeFoodData(data));
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return { foodList, loading, error };
}
