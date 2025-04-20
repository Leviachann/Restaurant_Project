import { useDrag } from "react-dnd";

export const useIngredientDrag = (ingredient, removeIngredient) => {
  const [, drag] = useDrag({
    type: "ingredient",
    item: ingredient,
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        removeIngredient(item.IngredientID);
      }
    },
  });

  return drag;
};