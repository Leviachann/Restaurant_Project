import React from "react";
import MenuItem from "../Order/MenuItem";
import { useFoodListLogic } from "../../hooks/useFoodListLogic";
import "../../css/App.css";

function FoodList({ addFoodItem }) {
  const { foodList, loading, error, handleMenuListNavigation } = useFoodListLogic();

  if (loading) return <p>Loading food list...</p>;
  if (error) return <p>Error fetching food list: {error.message}</p>;

  return (
    <div className="menu-container">
      <button
        className="menu-list-button"
        onClick={handleMenuListNavigation}
      >
        View Menu List
      </button>
      <div className="menu-grid">
        {foodList.length > 0 ? (
          foodList.map((item) => (
            <MenuItem key={item.foodID} item={item} addFoodItem={addFoodItem} />
          ))
        ) : (
          <p>No food items available.</p>
        )}
      </div>
    </div>
  );
}

export default FoodList;