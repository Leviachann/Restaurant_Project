export function sanitizeFoodData(data) {
  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => ({
      ...item,
      foodID: item.foodID || Math.random().toString(),
      name: item.name || "Unnamed Item",
      price: item.price || 0,
      customizations: item.customizations || [],
      imageSrc: item.imageSrc || "https://placehold.co/300x200",
    }));
  }
  console.error("Unexpected data structure:", data);
  return [];
}
