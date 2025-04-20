import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import PageLayout from "../components/Layout/PageLayout";
import MenuSelector from "../components/Layout/MenuSelector";
import FoodList from "../components/CustomFoodBuilder/FoodList";
import CustomFoodBuilder from "../components/CustomFoodBuilder/CustomFoodBuilder";
import OrderSummary from "../components/Order/OrderSummary";
import useFoodItems from "../hooks/useFoodItems";
import "../css/App.css";

function FoodZone() {
  const { foodItems, addFoodItem, removeFoodItem, clearFoodItems } = useFoodItems();
  const [screenState, setScreenState] = useState("walkin");
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    if (page === "fooditem" || page === "menu") {
      setAnimationPlaying(true);

      setTimeout(() => {
        navigate(`/foodzone/${page === "fooditem" ? "burgerbuilder" : "menus"}`);
        setScreenState("main");
        setAnimationPlaying(false);
      }, 3000);
    } else {
      navigate(`/foodzone/${page}`);
      setScreenState("main");
    }
  };

  const navigateToFoodZone = () => {
    navigate("/foodzone");
  };

  const navigateToOrderMonitor = () => {
    navigate("/ordermonitor");
  };

  const navigateToMain = () => {
    navigate("/secondhall");
  };

  const clearOrderList = () => {
    clearFoodItems();
  };

  React.useEffect(() => {
    if (screenState === "walkin") {
      const timer = setTimeout(() => {
        setScreenState("hall");
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [screenState]);

  if (animationPlaying) {
    return <div className="food-zone animation-playing"></div>;
  }

  if (screenState === "walkin") {
    return <div className="food-zone walkin"></div>;
  }

  if (screenState === "hall") {
    return (
      <div className="food-zone hall">
        <button
          className="hidden-button"
          onClick={() => handlePageChange("fooditem")}
        >
          Food Item
        </button>
        <button
          className="hidden-button menu"
          onClick={() => handlePageChange("menu")}
        >
          Menu
        </button>
        <button
          className="hidden-button go-back"
          onClick={() => setScreenState("main")}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (screenState === "main") {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <div className="food-zone hall">
              <button
                className="hidden-button"
                onClick={() => handlePageChange("fooditem")}
              >
                Food Item
              </button>
              <button
                className="hidden-button menu"
                onClick={() => handlePageChange("menu")}
              >
                Menu
              </button>
              <button
                className="hidden-button go-back"
                onClick={navigateToMain}
              >
                Go Back
              </button>
            </div>
          }
        />
        <Route
          path="burgerbuilder"
          element={
            <PageLayout
              leftContent={<CustomFoodBuilder addFoodItem={addFoodItem} />}
              rightContent={
                <OrderSummary
                  foodItems={foodItems}
                  removeFoodItem={removeFoodItem}
                  clearOrderList={clearOrderList}
                />
              }
              navigateToFoodZone={navigateToFoodZone}
              navigateToOrderMonitor={navigateToOrderMonitor}
            />
          }
        />
        <Route
          path="menus"
          element={
            <PageLayout
              leftContent={<MenuSelector addFoodItem={addFoodItem} />}
              rightContent={
                <OrderSummary
                  foodItems={foodItems}
                  removeFoodItem={removeFoodItem}
                  clearOrderList={clearOrderList}
                />
              }
              navigateToFoodZone={navigateToFoodZone}
              navigateToOrderMonitor={navigateToOrderMonitor}
            />
          }
        />
        <Route
          path="foodlist"
          element={
            <PageLayout
              leftContent={<FoodList addFoodItem={addFoodItem} />}
              rightContent={
                <OrderSummary
                  foodItems={foodItems}
                  removeFoodItem={removeFoodItem}
                  clearOrderList={clearOrderList}
                />
              }
              navigateToFoodZone={navigateToFoodZone}
              navigateToOrderMonitor={navigateToOrderMonitor}
            />
          }
        />
      </Routes>
    );
  }

  return null;
}

export default FoodZone;