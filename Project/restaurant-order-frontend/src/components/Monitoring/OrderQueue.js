import React, { useEffect, useState } from "react";
import axios from "axios";
import GoogleSignIn from "../Auth/GoogleSignIn";
import "../../css/App.css";

const OrderQueue = () => {
  const [orders, setOrders] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem('isAdmin');
    return storedAdmin === 'true';
  });

  const ADMIN_EMAILS = ['c.s.rustamov@gmail.com'];

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true' && !isAuthenticated) {
      setIsAuthenticated(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      const storedAdmin = localStorage.getItem('isAdmin');
      setIsAdmin(storedAdmin === 'true');
    }

    if (isAuthenticated && isAdmin) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isAdmin]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://localhost:7183/api/Order/all");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleLoginSuccess = (userData) => {
    const isAdminUser = ADMIN_EMAILS.includes(userData.email);
    if (isAdminUser) {
      setIsAuthenticated(true);
      setUser(userData);
      setIsAdmin(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAdmin', 'true');
    } else {
      alert("You don't have admin privileges. Please use an admin account.");
    }
  };

  const handleLoginError = () => {
    alert("Google login failed. Please try again.");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
    setOrders([]);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  };

  const handleMoveToReady = async (orderId) => {
    try {
      await axios.post(`https://localhost:7183/api/Order/move-to-ready/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error("Error moving order to ready queue:", error);
    }
  };

  const handleRemoveFromReady = async (orderId) => {
    try {
      await axios.post(`https://localhost:7183/api/Order/remove-from-ready/${orderId}`);
      fetchOrders();
    } catch (error) {
      console.error("Error removing order from ready queue:", error);
    }
  };

  const gettingReadyOrders = orders.filter((order) => order.status === "getting-ready");
  const readyOrders = orders.filter((order) => order.status === "ready");

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="auth-container">
        <GoogleSignIn 
          onSuccess={handleLoginSuccess} 
          onError={handleLoginError} 
        />
      </div>
    );
  }

  return (
    <div className="order-queue-container">
      <div className="admin-header">
        <h2>Welcome, {user.name}</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      
      <div className="order-queue">
        <h2>Getting Ready</h2>
        <div className="order-list">
          <ul>
            {gettingReadyOrders.map((order) => (
              <li key={order.orderID} className="order-item">
                <div className="order-details">
                  <span>Order #{order.orderID}</span>
                  <span>Total Price: ${order.totalPrice.toFixed(2)}</span>
                  <ul className="food-items">
                    {order.foodItems.map((foodItem, index) => (
                      <li key={index}>
                        <span>{foodItem.name || "Unnamed Item"}</span>
                        {foodItem.options && foodItem.options.length > 0 && (
                          <div>
                            <ul className="options">
                              {foodItem.options.map((option, idx) => (
                                <li key={idx}>{option}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {foodItem.customizations && foodItem.customizations.length > 0 && (
                          <div>
                            <ul className="customizations">
                              {foodItem.customizations.map((customization, idx) => (
                                <li key={idx}>{customization}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleMoveToReady(order.orderID)}
                  className="action-button"
                >
                  Mark as Ready
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="order-queue">
        <h2>Ready to Pick Up</h2>
        <div className="order-list">
          <ul>
            {readyOrders.map((order) => (
              <li key={order.orderID} className="order-item">
                <div className="order-details">
                  <span>Order #{order.orderID}</span>
                  <span>Total Price: ${order.totalPrice.toFixed(2)}</span>
                  <ul className="food-items">
                    {order.foodItems.map((foodItem, index) => (
                      <li key={index}>
                        <span>{foodItem.name || "Unnamed Item"}</span>
                        {foodItem.options && foodItem.options.length > 0 && (
                          <div>
                            <ul className="options">
                              {foodItem.options.map((option, idx) => (
                                <li key={idx}>{option}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {foodItem.customizations && foodItem.customizations.length > 0 && (
                          <div>
                            <ul className="customizations">
                              {foodItem.customizations.map((customization, idx) => (
                                <li key={idx}>{customization}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleRemoveFromReady(order.orderID)}
                  className="action-button"
                >
                  Picked Up
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderQueue;