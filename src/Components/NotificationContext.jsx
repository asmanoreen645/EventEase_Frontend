import React, { createContext, useContext, useState, useEffect } from 'react';
import API from "../../axiosConfig";
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // 1. Fetch Notifications from Database
  const fetchNotifications = async () => {
    // Check agar user logged in hai aur uski ID ya _id majood hai
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      const response = await API.get(`/api/notifications/user/${userId}`);
      if (response.data && response.data.success) {
        const list = response.data.data || [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Jab bhi logged-in user change ho, DB se notifications load hongi
  useEffect(() => {
    fetchNotifications();
    
    // Optional: Har 30 seconds baad auto-refresh for real-time updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // 2. Mark Notification as Read
  const markAsRead = async (id) => {
    try {
      // Local state instant update for UI responsiveness
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Backend API Call (agar read mark karne ka endpoint hai)
      // await API.put(`/api/notifications/read/${id}`);
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);