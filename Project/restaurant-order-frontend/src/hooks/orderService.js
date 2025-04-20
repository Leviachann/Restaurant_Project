export function placeOrder(foodItems) {
  const orderDetails = {
    OrderID: Date.now().toString(), 
    UserID: "456",
    FoodItems: foodItems.map((item) => ({
      FoodID: item.FoodID || "default-id",
      Name: item.name,
      Price: item.price,
      Options: item.options || [],
      Customizations: item.customizations?.map((customization) => customization.name) || [],
      ImageSrc: item.imageSrc || "",
    })),
    TotalPrice: foodItems.reduce((total, item) => total + (item.price || 0), 0),
    Status: "getting-ready",
  };

  return fetch("https://localhost:7183/api/Order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderDetails),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(JSON.stringify(errorData));
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Order placed successfully. Order ID:", data.orderID); 
      return data;
    });
}