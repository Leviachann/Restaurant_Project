import { useDrag } from "react-dnd";

export const useIngredientCardDrag = (ingredient, canDrag) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ingredient",
    item: ingredient,
    canDrag: canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return { isDragging, drag };
};