import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ingredientsList from "../../data/ingredientsData";
import IngredientCard from "../Ingredient/ingredientCard";
import StackablePlate from "../Plate/stackablePlate";
import { useCustomBurgerBuilder } from "../../hooks/useCustomBurgerBuilder";
import { canDragIngredient } from "../../utils/burgerBuilderUtils";
import "../../css/App.css";

function CustomBurgerBuilder({ addFoodItem }) {
  const MAX_INGREDIENTS = 8;
  const {
    customIngredients,
    setCustomIngredients,
    addIngredientToPlate,
    removeIngredientFromPlate,
  } = useCustomBurgerBuilder(MAX_INGREDIENTS);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="cbuilder custom-food-builder box-glow cbuild">
        <div className="cbuild">
          <StackablePlate
            customIngredients={customIngredients}
            setCustomIngredients={setCustomIngredients}
            addIngredient={addIngredientToPlate}
            removeIngredient={removeIngredientFromPlate}
            addFoodItem={addFoodItem}
            plateSize={{ width: "250px", height: "200px" }}
            ingredientSize={{ width: "40px", height: "40px" }}
          />
          <div className="ingredients-container">
            {ingredientsList.map((ingredient) => (
              <IngredientCard
                key={ingredient.IngredientID}
                ingredient={ingredient}
                canDrag={canDragIngredient(customIngredients, MAX_INGREDIENTS)}
                size={{ width: "40px", height: "40px" }}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default CustomBurgerBuilder;