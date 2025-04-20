import { useState } from "react";

export const useCustomBurgerBuilder = (MAX_INGREDIENTS) => {
  const [customIngredients, setCustomIngredients] = useState([]);

  const addIngredientToPlate = (ingredient) => {
    if (
      !customIngredients.some(
        (item) => item.IngredientID === ingredient.IngredientID
      ) &&
      customIngredients.length < MAX_INGREDIENTS
    ) {
      setCustomIngredients((prev) => [...prev, ingredient]);
    }
  };

  const removeIngredientFromPlate = (ingredientID) => {
    setCustomIngredients((prev) =>
      prev.filter((ingredient) => ingredient.IngredientID !== ingredientID)
    );
  };

  return {
    customIngredients,
    setCustomIngredients,
    addIngredientToPlate,
    removeIngredientFromPlate,
  };
};