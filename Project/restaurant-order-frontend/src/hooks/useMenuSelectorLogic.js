import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useFoodList } from "./useFoodList";

export const useMenuSelectorLogic = (addFoodItem) => { 
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customOptions, setCustomOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedOptionToReplace, setSelectedOptionToReplace] = useState(null);

  const { foodList, loading: foodLoading, error: foodError } = useFoodList();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("https://localhost:7183/api/menu")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const updatedData = data.map((item) => ({
          ...item,
          imageSrc: item.imageSrc || "https://placehold.co/300x200",
        }));
        setMenu(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const getPriceForOption = (option) => {
    const matchingFoodItem = foodList.find((food) => food.name === option);
    return matchingFoodItem ? matchingFoodItem.price : 2;
  };

  const recalculateTotalPrice = (options) => {
    const total = options.reduce((sum, option) => sum + getPriceForOption(option), 0);
    setTotalPrice(total);
  };

  const openPopup = (item) => {
    setSelectedItem(item);
    const initialOptions = [...item.options];
    setCustomOptions(initialOptions);
    recalculateTotalPrice(initialOptions);
    setShowPopup(true);
  };

  const removeOption = (optionToRemove) => {
    const updatedOptions = customOptions.filter((opt) => opt !== optionToRemove);
    setCustomOptions(updatedOptions);
    recalculateTotalPrice(updatedOptions);
  };

  const openReplaceModal = (option) => {
    setSelectedOptionToReplace(option);
    setShowReplaceModal(true);
  };

  const replaceOption = (newOption) => {
    const updatedOptions = customOptions.map((opt) =>
      opt === selectedOptionToReplace ? newOption.name : opt
    );
    setCustomOptions(updatedOptions);
    recalculateTotalPrice(updatedOptions);
    setShowReplaceModal(false);
  };

  const handleAddToOrder = () => {
    const orderItem = {
      ...selectedItem,
      options: customOptions,
      price: totalPrice,
      FoodID: selectedItem.menuID,
    };
    addFoodItem(orderItem); 
    setShowPopup(false);
  };

  const handleFoodListNavigation = () => {
    navigate("/foodzone/foodlist");
  };

  return {
    menu,
    loading,
    error,
    showPopup,
    selectedItem,
    customOptions,
    totalPrice,
    showReplaceModal,
    selectedOptionToReplace,
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
  };
};