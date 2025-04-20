import { useNavigate } from "react-router-dom";
import { useFoodList } from "./useFoodList";

export const useFoodListLogic = () => {
  const { foodList, loading, error } = useFoodList();
  const navigate = useNavigate();

  const handleMenuListNavigation = () => {
    navigate("/foodzone/menus");
  };

  return { foodList, loading, error, handleMenuListNavigation };
};