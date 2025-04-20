import React from "react";
import { useIngredientListLogic } from "../../hooks/useIngredientListLogic";
import "../../css/App.css";

function IngredientList({
  customIngredients,
  calculatePrice,
  handleAddToOrder,
  removeIngredient,
}) {
  const { customIngredients: ingredients } = useIngredientListLogic(
    customIngredients,
    calculatePrice,
    handleAddToOrder,
    removeIngredient
  );

  return (
    <div className="ingredient-list">
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>
            <span>{ingredient.Name}</span>
            <button
              className="remove-ingredient-button"
              onClick={() => removeIngredient(ingredient.IngredientID)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
      <h4>Total Price: ${calculatePrice().toFixed(2)}</h4>
      <button
        className="add-food-button"
        onClick={handleAddToOrder}
        disabled={ingredients.length === 0}
      >
        Add to Order
      </button>
    </div>
  );
}

export default IngredientList;