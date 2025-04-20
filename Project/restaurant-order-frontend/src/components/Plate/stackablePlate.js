import React, { useState } from "react";
import Plate from "./Plate";
import IngredientList from "../Ingredient/IngredientList";

function StackablePlate({
  customIngredients,
  setCustomIngredients,
  addIngredient,
  removeIngredient,
  addFoodItem,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const startingOffset = 40;

  const calculateSpacing = (index) => {
    if (hoveredIndex !== null && index >= hoveredIndex) {
      return `${startingOffset + index * 25}px`;
    }
    return `${startingOffset + index * 12}px`;
  };

  const calculatePrice = () =>
    customIngredients.reduce((total, item) => total + item.PriceAdjustment, 0) +
    3;

    const handleAddToOrder = () => {
      if (customIngredients.length === 0) return;
    
      const foodItem = {
        FoodID: Math.random().toString(),
        name: "Custom Burger",
        price: calculatePrice(),
        options: [],
        customizations: customIngredients.map((ingredient) => ({
          ingredientID: ingredient.IngredientID,
          name: ingredient.Name,
          priceAdjustment: ingredient.PriceAdjustment,
        })),
      };
    
      addFoodItem(foodItem); 
      setCustomIngredients([]);
    };

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "0px" }}>
      <IngredientList
        customIngredients={customIngredients}
        calculatePrice={calculatePrice}
        handleAddToOrder={handleAddToOrder}
        removeIngredient={removeIngredient}
      />
      <Plate
        customIngredients={customIngredients}
        setCustomIngredients={setCustomIngredients}
        removeIngredient={removeIngredient}
        calculateSpacing={calculateSpacing} 
        hoveredIndex={hoveredIndex}
        setHoveredIndex={setHoveredIndex}
      />
    </div>
  );
}

export default StackablePlate;