import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import API from "../api/axiosConfig";
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // 1. Fetch Notifications from Database (GET /api/notifications)
 // eslint-disable-next-line react-hooks/exhaustive-deps
 
  const fetchNotifications = useCallback(async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
        const response = await API.get('/notifications'); 

        if (response.data && response.data.success) {
            const list = response.data.notifications || response.data.data || [];
            setNotifications(list);
            setUnreadCount(list.filter(n => !n.isRead).length);
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
  }, [user]);

  // Jab bhi user change ho, notifications fetch karein
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // 2. Mark Single Notification as Read (PATCH /api/notifications/:id/read)
  const markAsRead = async (id) => {
    try {
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      await API.patch(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
  };

  // 3. Mark All as Read (PATCH /api/notifications/read-all)
  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await API.patch('/notifications/read-all');
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  // 4. Delete Notification (DELETE /api/notifications/:id)
  const deleteNotification = async (id) => {
    try {
      setNotifications(prev => {
        const updated = prev.filter(n => n._id !== id);
        setUnreadCount(updated.filter(n => !n.isRead).length);
        return updated;
      });

      await API.delete(`/notifications/${id}`);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification, 
        fetchNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);