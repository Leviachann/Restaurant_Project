import React from "react";
import { useMenuSelectorLogic } from "../../hooks/useMenuSelectorLogic";
import "../../css/App.css";

function MenuSelector({ addFoodItem }) {
  const {
    menu,
    loading,
    error,
    showPopup,
    selectedItem,
    customOptions,
    totalPrice,
    showReplaceModal,
    foodList,
    foodLoading,
    foodError,
    openPopup,
    removeOption,
    openReplaceModal,
    replaceOption,
    handleAddToOrder,
    handleFoodListNavigation,
    getPriceForOption,
    setShowPopup,
    setShowReplaceModal,
  } = useMenuSelectorLogic(addFoodItem);

  if (loading || foodLoading) return <p>Loading...</p>;
  if (error || foodError) return <p>Error fetching data.</p>;

  return (
    <div className="menu-container">
      <button
        className="view-food-list-button"
        onClick={handleFoodListNavigation}
      >
        View Full Food List
      </button>
      <div className="menu-grid">
        {menu.map((item, index) => (
          <div key={item.menuID || index} className="menu-item">
            <div className="menu-image-container">
              <img
                src={item.imageSrc}
                alt={item.name}
                className="menu-image"
                onError={(e) => {
                  e.target.src = "https://placehold.co/300x200";
                }}
              />
              <div className="menu-overlay">
                <h3>{item.name}</h3>
                <p>Price: ${item.price ? item.price.toFixed(2) : "0.00"}</p>
                <button onClick={() => openPopup(item)}>Add to Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showPopup && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Customize Your Order</h3>
            <h4>{selectedItem.name}</h4>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <ul className="modal-options">
              {customOptions.length > 0 ? (
                customOptions.map((option, idx) => (
                  <li key={idx} className="modal-option">
                    {option} (${getPriceForOption(option).toFixed(2)})
                    <button
                      onClick={() => removeOption(option)}
                      className="remove-btn"
                    >
                      X
                    </button>
                    <button
                      onClick={() => openReplaceModal(option)}
                      className="replace-btn"
                    >
                      Replace
                    </button>
                  </li>
                ))
              ) : (
                <li className="empty-options-message">No items selected</li>
              )}
            </ul>
            <button 
              onClick={handleAddToOrder} 
              className="confirm-btn"
              disabled={customOptions.length === 0}
            >
              Add to Order
            </button>
            <button onClick={() => setShowPopup(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
      {showReplaceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Choose a Replacement</h3>
            <ul className="modal-options">
              {foodList.map((foodItem) => (
                <li key={foodItem.foodID} className="modal-option">
                  {foodItem.name} (${foodItem.price.toFixed(2)})
                  <button
                    onClick={() => replaceOption(foodItem)}
                    className="replace-btn"
                  >
                    Replace
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowReplaceModal(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuSelector;