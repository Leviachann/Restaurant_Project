import React from "react";
import { useIngredientCardDrag } from "../../hooks/useIngredientCardDrag";
import "../../css/App.css";

function IngredientCard({ ingredient, canDrag }) {
  const { isDragging, drag } = useIngredientCardDrag(ingredient, canDrag);

  return (
    <div
      ref={canDrag ? drag : null}
      className={`ingredient ingredient-card fade-in ${isDragging ? "dragging" : ""} ${
        canDrag ? "grab" : "not-allowed"
      }`}
    >
      <img src={ingredient.Image} alt={ingredient.Name} />
    </div>
  );
}

export default IngredientCard;