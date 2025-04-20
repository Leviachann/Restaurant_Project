import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import Ingredient from "../Ingredient/Ingredient";
import "../../css/App.css";

function Plate({
  customIngredients,
  setCustomIngredients,
  removeIngredient,
  calculateSpacing,
  hoveredIndex,
  setHoveredIndex,
}) {
  const plateRef = useRef();

  const [, drop] = useDrop({
    accept: "ingredient",
    hover: (draggedItem, monitor) => {
      const offset = monitor.getClientOffset();
      const plateBounds = plateRef.current.getBoundingClientRect();

      if (offset) {
        let dropY = offset.y - plateBounds.top;
        dropY = Math.max(40, Math.min(dropY, plateBounds.height));

        const index = Math.min(
          Math.max(Math.floor((dropY - 40) / 45), 0),
          customIngredients.length
        );

        setHoveredIndex(index);
      }
    },
    drop: (draggedItem, monitor) => {
      const offset = monitor.getClientOffset();
      const plateBounds = plateRef.current.getBoundingClientRect();

      if (offset) {
        let dropY = offset.y - plateBounds.top;
        dropY = Math.max(40, Math.min(dropY, plateBounds.height));

        const index = Math.min(
          Math.max(Math.floor((dropY - 40) / 45), 0),
          customIngredients.length
        );

        const updatedIngredients = [...customIngredients];
        const existingIndex = updatedIngredients.findIndex(
          (item) => item.IngredientID === draggedItem.IngredientID
        );

        if (existingIndex >= 0) {
          updatedIngredients.splice(existingIndex, 1);
        }
        updatedIngredients.splice(index, 0, draggedItem);

        setCustomIngredients(updatedIngredients);
      }
      setHoveredIndex(null);
    },
  });

  drop(plateRef);

  return (
    <div ref={plateRef} className="plate">
      {customIngredients.length === 0 ? (
        <p>Drag ingredients here!</p>
      ) : (
        customIngredients.map((ingredient, index) => (
          <Ingredient
            key={ingredient.IngredientID}
            ingredient={ingredient}
            index={index}
            calculateSpacing={calculateSpacing}
            removeIngredient={removeIngredient}
          />
        ))
      )}
    </div>
  );
}

export default Plate;