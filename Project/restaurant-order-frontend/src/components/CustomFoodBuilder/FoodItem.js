import React from "react";

function FoodItem({ item, onRemove }) {
  return (
    <div className="food-item">
      <div className="food-item-header">
        <h4>{item.name}</h4>
        <button className="remove-item" onClick={onRemove}>X</button>
      </div>
      <p>Price: ${item.price ? item.price.toFixed(2) : "0.00"}</p>
      {item.options && item.options.length > 0 && (
        <div>
          <strong>Options:</strong>
          <ul>
            {item.options.map((option, idx) => (
              <li key={idx}>{option}</li>
            ))}
          </ul>
        </div>
      )}
      {item.customizations && item.customizations.length > 0 && (
        <div>
          <strong>Customizations:</strong>
          <ul>
            {item.customizations.map((customization, idx) => (
              <li key={idx}>{customization.name || "Default Ingredient"}: ${customization.priceAdjustment || 0}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FoodItem;