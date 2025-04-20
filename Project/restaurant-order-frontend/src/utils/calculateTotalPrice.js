export function calculateTotalPrice(foodItems) {
  return foodItems.reduce((total, item) => total + (item.price || 0), 0);
}
