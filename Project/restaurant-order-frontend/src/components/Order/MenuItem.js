import React from "react";

function MenuItem({ item, addFoodItem }) {
  return (
    <div className="menu-item">
      <div className="menu-image-container">
        <img
          src={item.imageSrc}
          alt={item.name}
          className="menu-image"
          onError={(e) => {
            console.log("Fallback image loaded for", item.name);
            e.target.src = "https://placehold.co/300x200";
          }}
        />
        <div className="menu-overlay">
          <h3>{item.name}</h3>
          <p>Price: ${item.price ? item.price.toFixed(2) : "0.00"}</p>
          <button
            className="cc-button"
            onClick={() =>
              addFoodItem({
                ...item,
                options: item.options || [], 
                customizations: item.customizations || [], 
              })
            }
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;

