export const useIngredientListLogic = (customIngredients, calculatePrice, handleAddToOrder, removeIngredient) => {
    return { customIngredients, calculatePrice, handleAddToOrder, removeIngredient };
  };