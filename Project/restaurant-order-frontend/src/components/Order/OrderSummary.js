import React from "react";
import { useNavigate } from "react-router-dom";
import FoodItem from "../CustomFoodBuilder/FoodItem";
import { calculateTotalPrice } from "../../utils/calculateTotalPrice";
import { placeOrder } from "../../hooks/orderService";
import "../../css/App.css";

function OrderSummary({ foodItems, removeFoodItem}) {
  const navigate = useNavigate();

  const totalPrice = calculateTotalPrice(foodItems);

  const handlePlaceOrder = () => {
    placeOrder(foodItems)
      .then((data) => {
        console.log("Order placed successfully. Order ID:", data.orderID);
        navigate(`/ordermonitor?orderId=${data.orderID}`);
      })
      .catch((error) => {
        alert("Failed to place order: " + error.message);
      });
  };

  return (
    <div className="order-summary box-glow">
      <div className="order-items-container">
        {foodItems.length > 0 ? (
          foodItems.map((item, index) => (
            <FoodItem
              key={index}
              item={item}
              onRemove={() => removeFoodItem(index)}
            />
          ))
        ) : (
          <p>Your order is empty. Please add delicious items to enjoy!</p>
        )}
      </div>
      <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
      <button className="placeOrder" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}

export default OrderSummary;