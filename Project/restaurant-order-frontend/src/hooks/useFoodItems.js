import { useState } from "react";

function useFoodItems() {
  const [foodItems, setFoodItems] = useState([]);

  const addFoodItem = (foodItem) => {
    setFoodItems((prev) => [...prev, foodItem]);
  };

  const removeFoodItem = (index) => {
    setFoodItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const clearFoodItems = () => {
    setFoodItems([]); 
  };

  return { foodItems, addFoodItem, removeFoodItem, clearFoodItems };
}

export default useFoodItems;