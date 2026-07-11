import { useNotifications } from "./NotificationContext";
import NotificationItem from "./NotificationItem";

function NotificationDropdown({ closeDropdown }) {
  const { notifications } = useNotifications();

  return (
    <div
      style={{
        position: "absolute",
        top: "35px",
        right: 0,
        width: "300px",
        background: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        borderRadius: "8px",
        zIndex: 1000,
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "10px",
          fontWeight: "bold",
          borderBottom: "1px solid #eee",
        }}
      >
        Notifications
      </div>

      {notifications.length === 0 ? (
        <p style={{ padding: "10px", color: "#888", fontSize: "14px" }}>
          No notifications yet
        </p>
      ) : (
        notifications.map((notif) => (
          <NotificationItem
            key={notif._id}
            notification={notif}
            closeDropdown={closeDropdown}
          />
        ))
      )}
    </div>
  );
}

export default NotificationDropdown;