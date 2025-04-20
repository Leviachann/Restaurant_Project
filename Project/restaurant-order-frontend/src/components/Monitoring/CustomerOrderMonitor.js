import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";

const CustomerOrderMonitor = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://localhost:7183/api/Order/all");
        if (isMounted) {
          setOrders(response.data);
          setOrdersLoaded(true);
          console.log("Orders fetched:", response.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching orders:", error);
        }
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    const animationTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(animationTimeout);
    };
  }, []);

  useEffect(() => {
    if (ordersLoaded) {
      const queryParams = new URLSearchParams(location.search);
      const orderIdFromUrl = queryParams.get("orderId");
      console.log("Order ID from URL:", orderIdFromUrl);

      if (orderIdFromUrl) {
        const orderIdToNumberMap = new Map();
        orders.forEach((order, index) => {
          orderIdToNumberMap.set(order.orderID, index + 1);
        });

        console.log("Order ID to Number Map:", orderIdToNumberMap);

        const orderNumber = orderIdToNumberMap.get(orderIdFromUrl);
        console.log("Sequential Order Number:", orderNumber);

        if (orderNumber !== undefined) {
          setOrderNumber(orderNumber);
          setShowPopup(true);
        } else {
          console.error("Order ID not found in the map:", orderIdFromUrl);
        }
      }
    }
  }, [location.search, ordersLoaded, orders]);

  const handlePopupConfirm = () => {
    setShowPopup(false);
    navigate("/ordermonitor");
  };

  const handleGoBackToMain = () => {
    navigate("/foodzone");
  };

  const gettingReadyOrders = orders.filter((order) => order.status === "getting-ready");
  const readyOrders = orders.filter((order) => order.status === "ready");
  const orderIdToNumberMap = new Map();
  orders.forEach((order, index) => {
    orderIdToNumberMap.set(order.orderID, index + 1);
  });

  return (
    <div className="customer-order-monitors">
      {isLoading ? (
        <div className="loading-animation"></div>
      ) : (
        <div>
          <div className="order-listss">
            <div className="order-lists">
              <h2>Getting Ready</h2>
              <div className="order-list-scroll">
                <ul>
                  {gettingReadyOrders.map((order) => (
                    <li key={order.orderID} className="order-items">
                      <span>Order {orderIdToNumberMap.get(order.orderID)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="order-lists">
              <h2>Ready to Pick Up</h2>
              <div className="order-list-scroll">
                <ul>
                  {readyOrders.map((order) => (
                    <li key={order.orderID} className="order-items">
                      <span>Order {orderIdToNumberMap.get(order.orderID)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <button className="go-back-button" onClick={handleGoBackToMain}>
            Go Back to Main
          </button>
        </div>
      )}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Order Confirmed!</h3>
            <p>Your Order Number is: <strong>{orderNumber}</strong></p>
            <button onClick={handlePopupConfirm}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderMonitor;