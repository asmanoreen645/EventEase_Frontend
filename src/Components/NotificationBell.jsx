import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
//import NotificationItem from "../NotificationItem";
//import NotificationItem from "/src/Components/NotificationItem";
import NotificationItem from "./NotificationItem";

export default function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, unreadCount } = useNotifications();
  const dropdownRef = useRef(null);

  // Outside click listener: Bahar click hone par dropdown automatic hide hoga
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Bell Icon & Badge */}
      <div 
        onClick={() => setShowDropdown(!showDropdown)} 
        style={{ position: "relative", cursor: "pointer", fontSize: "20px", padding: "5px" }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "0px",
            right: "0px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "11px",
            fontWeight: "bold"
          }}>
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notifications Dropdown Panel */}
      {showDropdown && (
        <div style={{
          position: "absolute",
          top: "40px",
          right: 0,
          width: "300px",
          maxHeight: "360px",
          overflowY: "auto",
          background: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "8px",
          zIndex: 1100,
          padding: "10px"
        }}>
          <h4 style={{ margin: "0 0 10px 0", paddingBottom: "5px", borderBottom: "1px solid #eee" }}>
            Notifications
          </h4>
          
          {notifications.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#888", textAlign: "center", margin: "20px 0" }}>
              No notifications yet.
            </p>
          ) : (
            notifications.map((item) => (
              <NotificationItem 
                key={item._id} 
                notification={item} 
                closeDropdown={() => setShowDropdown(false)} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}