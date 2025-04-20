import React, { useRef } from "react";
import { useIngredientDrag } from "../../hooks/useIngredientDrag";
import "../../css/App.css";

function Ingredient({ ingredient, index, calculateSpacing, removeIngredient }) {
  const ref = useRef();
  const drag = useIngredientDrag(ingredient, removeIngredient);
  drag(ref);

  return (
    <img
      ref={ref}
      src={ingredient.Image}
      alt={ingredient.Name}
      className="ingredientt"
      style={{
        top: calculateSpacing(index),
        zIndex: 10 - index,
      }}
    />
  );
}

export default Ingredient;